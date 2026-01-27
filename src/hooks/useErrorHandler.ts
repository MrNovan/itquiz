import { useState, useCallback } from 'react';
import { ErrorType } from '../types/errors';

interface UseErrorHandlerReturn {
  error: (Error & { type?: ErrorType; statusCode?: number }) | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<(Error & { type?: ErrorType; statusCode?: number }) | null>(null);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err as Error & { type?: ErrorType; statusCode?: number });
    } else {
      setError(new Error(String(err)));
    }
  }, []);
  
  return {
    error,
    setError,
    clearError,
    handleError
  };
};
