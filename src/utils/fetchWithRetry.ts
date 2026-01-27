import { ErrorClassifier } from './errorClassifier';
import { RetryConfig, FetchOptions } from '../types/errors';

/**
 * Обёртка над fetch API с автоматическими повторными попытками и exponential backoff.
 * 
 * Автоматически повторяет временные ошибки (5xx, network errors, 408, 429, 503)
 * с экспоненциально увеличивающейся задержкой между попытками.
 */
export class FetchWithRetry {
  private static readonly DEFAULT_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    retryableStatuses: [408, 429, 503]
  };
  
  /**
   * Выполняет HTTP запрос с автоматическими повторными попытками при временных ошибках.
   * 
   * @param url - URL для запроса
   * @param options - Опции fetch с дополнительной конфигурацией retry
   * @returns Promise с Response объектом
   * @throws Error с дополнительными полями type, statusCode, isRetryable
   * 
   * @example
   * // Простой GET запрос с дефолтной retry конфигурацией
   * const response = await FetchWithRetry.fetch('/api/data');
   * 
   * @example
   * // POST запрос с кастомной retry конфигурацией
   * const response = await FetchWithRetry.fetch('/api/data', {
   *   method: 'POST',
   *   body: JSON.stringify(data),
   *   retryConfig: { maxRetries: 1 }
   * });
   * 
   * @example
   * // Отключение retry для конкретного запроса
   * const response = await FetchWithRetry.fetch('/api/data', {
   *   retryConfig: { noRetry: true }
   * });
   */
  static async fetch(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const config = { ...this.DEFAULT_CONFIG, ...options.retryConfig };
    
    // Если retry отключен
    if (config.noRetry) {
      return this.executeFetch(url, options);
    }
    
    // Для POST/PUT/DELETE используем меньше попыток
    const maxRetries = this.shouldReduceRetries(options.method) 
      ? 1 
      : config.maxRetries;
    
    let lastError: any = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.executeFetch(url, options);
        
        // Успешный ответ
        if (response.ok) {
          if (attempt > 0) {
            console.info(`[Retry Success] Request succeeded after ${attempt} retries`, {
              url,
              method: options.method || 'GET',
              attempts: attempt + 1
            });
          }
          return response;
        }
        
        // Классифицируем ошибку
        const classifiedError = ErrorClassifier.classify(
          new Error(`HTTP ${response.status}`),
          response
        );
        
        // Если ошибка не retryable - выбрасываем сразу
        if (!classifiedError.isRetryable) {
          console.error('[Non-retryable Error]', {
            url,
            method: options.method || 'GET',
            error: classifiedError
          });
          throw this.createError(classifiedError);
        }
        
        lastError = classifiedError;
        
        // Если это не последняя попытка - ждём и повторяем
        if (attempt < maxRetries) {
          const delay = this.calculateDelay(attempt, config);
          console.warn(`[Retry Attempt ${attempt + 1}/${maxRetries}]`, {
            url,
            method: options.method || 'GET',
            error: classifiedError.message,
            nextRetryIn: `${delay}ms`
          });
          await this.sleep(delay);
        }
        
      } catch (error) {
        // Сетевая ошибка (fetch failed)
        const classifiedError = ErrorClassifier.classify(error);
        
        if (!classifiedError.isRetryable || attempt === maxRetries) {
          console.error('[Final Error]', {
            url,
            method: options.method || 'GET',
            attempts: attempt + 1,
            error: classifiedError
          });
          throw this.createError(classifiedError);
        }
        
        lastError = classifiedError;
        
        const delay = this.calculateDelay(attempt, config);
        console.warn(`[Retry Attempt ${attempt + 1}/${maxRetries}]`, {
          url,
          method: options.method || 'GET',
          error: classifiedError.message,
          nextRetryIn: `${delay}ms`
        });
        await this.sleep(delay);
      }
    }
    
    // Все попытки исчерпаны
    throw this.createError(lastError);
  }
  
  /**
   * Выполняет фактический fetch запрос.
   * 
   * @param url - URL для запроса
   * @param options - Опции fetch
   * @returns Promise с Response объектом
   * @private
   */
  private static async executeFetch(
    url: string,
    options: FetchOptions
  ): Promise<Response> {
    return fetch(url, options);
  }
  
  /**
   * Вычисляет задержку для следующей retry попытки используя exponential backoff.
   * 
   * Формула: min(baseDelay * 2^attempt, maxDelay)
   * 
   * @param attempt - Номер текущей попытки (0-based)
   * @param config - Конфигурация retry с baseDelay и maxDelay
   * @returns Задержка в миллисекундах
   * @private
   * 
   * @example
   * // attempt=0, baseDelay=1000 -> 1000ms
   * // attempt=1, baseDelay=1000 -> 2000ms
   * // attempt=2, baseDelay=1000 -> 4000ms
   * // attempt=3, baseDelay=1000 -> 8000ms (если maxDelay=8000)
   */
  private static calculateDelay(attempt: number, config: RetryConfig): number {
    // Exponential backoff: baseDelay * 2^attempt
    const exponentialDelay = config.baseDelay * Math.pow(2, attempt);
    // Ограничиваем максимальной задержкой
    return Math.min(exponentialDelay, config.maxDelay);
  }
  
  /**
   * Асинхронная задержка выполнения.
   * 
   * @param ms - Время задержки в миллисекундах
   * @returns Promise, который резолвится после указанной задержки
   * @private
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Определяет, нужно ли уменьшить количество retry попыток для данного HTTP метода.
   * 
   * Мутирующие методы (POST, PUT, DELETE, PATCH) используют меньше попыток
   * для предотвращения дублирования данных.
   * 
   * @param method - HTTP метод (GET, POST, PUT, DELETE, PATCH)
   * @returns true если метод мутирующий, false иначе
   * @private
   */
  private static shouldReduceRetries(method?: string): boolean {
    const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    return mutatingMethods.includes(method?.toUpperCase() || '');
  }
  
  /**
   * Создаёт Error объект с дополнительными полями из ClassifiedError.
   * 
   * @param classifiedError - Классифицированная ошибка
   * @returns Error объект с полями type, statusCode, isRetryable
   * @private
   */
  private static createError(classifiedError: any): Error {
    const error = new Error(classifiedError.message);
    (error as any).type = classifiedError.type;
    (error as any).statusCode = classifiedError.statusCode;
    (error as any).isRetryable = classifiedError.isRetryable;
    return error;
  }
}
