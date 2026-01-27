import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { ErrorType } from '../types/errors';

/**
 * Пропсы для компонента ErrorFallback.
 */
interface ErrorFallbackProps {
  /** Ошибка для отображения с опциональными полями type и statusCode */
  error: Error & { type?: ErrorType; statusCode?: number };
  /** Callback функция, вызываемая при клике на кнопку "Повторить попытку" */
  onRetry: () => void;
  /** Опциональный кастомный заголовок ошибки */
  title?: string;
}

/**
 * Компонент для отображения состояния ошибки с возможностью повторной попытки.
 * 
 * Отображает понятное сообщение об ошибке с соответствующей иконкой и кнопкой retry.
 * Поддерживает различные типы ошибок (Network, HTTP Server, HTTP Client) и dark mode.
 * 
 * @param props - Пропсы компонента
 * @returns JSX элемент с UI ошибки
 * 
 * @example
 * ```tsx
 * <ErrorFallback 
 *   error={error} 
 *   onRetry={() => loadData()} 
 *   title="Не удалось загрузить данные"
 * />
 * ```
 */
export const ErrorFallback = ({ error, onRetry, title }: ErrorFallbackProps) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case ErrorType.NETWORK:
        return <WifiOff className="w-16 h-16 text-red-500" />;
      case ErrorType.HTTP_SERVER:
        return <AlertCircle className="w-16 h-16 text-orange-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-red-500" />;
    }
  };
  
  const getErrorTitle = () => {
    if (title) return title;
    
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Проблема с подключением';
      case ErrorType.HTTP_SERVER:
        return 'Сервер временно недоступен';
      case ErrorType.HTTP_CLIENT:
        return 'Ошибка запроса';
      default:
        return 'Произошла ошибка';
    }
  };
  
  const getErrorDescription = () => {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Не удалось подключиться к серверу. Проверьте интернет-соединение.';
      case ErrorType.HTTP_SERVER:
        return 'Сервер временно недоступен. Попробуйте повторить попытку через несколько секунд.';
      case ErrorType.HTTP_CLIENT:
        return error.message || 'Запрос содержит ошибку. Попробуйте обновить страницу.';
      default:
        return error.message || 'Что-то пошло не так. Попробуйте повторить попытку.';
    }
  };
  
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          {getErrorIcon()}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {getErrorTitle()}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {getErrorDescription()}
        </p>
        
        {error.statusCode && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Код ошибки: {error.statusCode}
          </p>
        )}
        
        <button
          onClick={onRetry}
          className="flex items-center justify-center w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Повторить попытку
        </button>
      </div>
    </div>
  );
};

/**
 * Компактная версия ErrorFallback для inline использования.
 * 
 * Отображает компактное сообщение об ошибке с ссылкой для повторной попытки.
 * Подходит для встраивания в формы или небольшие секции страницы.
 * 
 * @param props - Пропсы компонента (те же что у ErrorFallback)
 * @returns JSX элемент с компактным UI ошибки
 * 
 * @example
 * ```tsx
 * <InlineErrorFallback 
 *   error={error} 
 *   onRetry={() => loadData()} 
 * />
 * ```
 */
export const InlineErrorFallback = ({ error, onRetry }: ErrorFallbackProps) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
            {error.message}
          </h3>
          <button
            onClick={onRetry}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    </div>
  );
};
