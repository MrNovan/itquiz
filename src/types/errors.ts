export enum ErrorType {
  NETWORK = 'NETWORK',      // Сетевая ошибка (fetch failed)
  HTTP_CLIENT = 'HTTP_CLIENT', // 4xx ошибки
  HTTP_SERVER = 'HTTP_SERVER', // 5xx ошибки
  TIMEOUT = 'TIMEOUT',      // Таймаут запроса
  UNKNOWN = 'UNKNOWN'       // Неизвестная ошибка
}

export interface ClassifiedError {
  type: ErrorType;
  isRetryable: boolean;
  statusCode?: number;
  message: string;
  originalError: Error;
}

export interface RetryConfig {
  maxRetries: number;      // Максимальное количество попыток (по умолчанию 3)
  baseDelay: number;       // Базовая задержка в мс (по умолчанию 1000)
  maxDelay: number;        // Максимальная задержка в мс (по умолчанию 8000)
  retryableStatuses: number[]; // HTTP статусы для retry (408, 429, 503, 5xx)
  noRetry?: boolean;       // Флаг для отключения retry
}

export interface FetchOptions extends RequestInit {
  retryConfig?: Partial<RetryConfig>;
}
