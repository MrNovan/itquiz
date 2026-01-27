import { ErrorType, ClassifiedError } from '../types/errors';

/**
 * Класс для классификации сетевых ошибок и определения стратегии их обработки.
 * 
 * Классифицирует ошибки на основе HTTP статусов и типов ошибок fetch API,
 * определяя, является ли ошибка временной (retryable) или постоянной.
 */
export class ErrorClassifier {
  private static readonly RETRYABLE_STATUSES = [408, 429, 503];
  
  /**
   * Классифицирует ошибку и определяет, можно ли её повторить.
   * 
   * @param error - Ошибка для классификации (может быть Error, TypeError или любой другой тип)
   * @param response - Опциональный Response объект от fetch API
   * @returns ClassifiedError объект с типом ошибки, флагом retryable и сообщением
   * 
   * @example
   * // Сетевая ошибка
   * const error = ErrorClassifier.classify(new TypeError('Failed to fetch'));
   * // { type: 'NETWORK', isRetryable: true, message: '...' }
   * 
   * @example
   * // HTTP ошибка
   * const response = new Response(null, { status: 500 });
   * const error = ErrorClassifier.classify(new Error('Server error'), response);
   * // { type: 'HTTP_SERVER', isRetryable: true, statusCode: 500, message: '...' }
   */
  static classify(error: unknown, response?: Response): ClassifiedError {
    // Сетевая ошибка (fetch failed - нет response)
    if (!response && error instanceof TypeError) {
      return {
        type: ErrorType.NETWORK,
        isRetryable: true,
        message: 'Проблема с подключением к серверу',
        originalError: error as Error
      };
    }
    
    // HTTP ошибки
    if (response && !response.ok) {
      const statusCode = response.status;
      
      // 5xx - серверные ошибки (retryable)
      if (statusCode >= 500) {
        return {
          type: ErrorType.HTTP_SERVER,
          isRetryable: true,
          statusCode,
          message: 'Сервер временно недоступен',
          originalError: error as Error
        };
      }
      
      // 408, 429, 503 - специальные retryable статусы
      if (this.RETRYABLE_STATUSES.includes(statusCode)) {
        return {
          type: statusCode === 408 ? ErrorType.TIMEOUT : ErrorType.HTTP_SERVER,
          isRetryable: true,
          statusCode,
          message: this.getMessageForStatus(statusCode),
          originalError: error as Error
        };
      }
      
      // 4xx - клиентские ошибки (не retryable)
      if (statusCode >= 400) {
        return {
          type: ErrorType.HTTP_CLIENT,
          isRetryable: false,
          statusCode,
          message: `Ошибка запроса (${statusCode})`,
          originalError: error as Error
        };
      }
    }
    
    // Неизвестная ошибка
    return {
      type: ErrorType.UNKNOWN,
      isRetryable: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      originalError: error as Error
    };
  }
  
  /**
   * Возвращает человекочитаемое сообщение для специальных HTTP статусов.
   * 
   * @param status - HTTP статус код
   * @returns Локализованное сообщение об ошибке
   * @private
   */
  private static getMessageForStatus(status: number): string {
    switch (status) {
      case 408: return 'Превышено время ожидания ответа';
      case 429: return 'Слишком много запросов, попробуйте позже';
      case 503: return 'Сервис временно недоступен';
      default: return `Ошибка сервера (${status})`;
    }
  }
}
