/**
 * Константы настроек квиза
 */

// Настройки по умолчанию
export const DEFAULT_TIME_PER_QUESTION = 30; // секунд
export const DEFAULT_QUESTION_COUNT = 5;

// Доступные опции для настроек
export const TIME_OPTIONS = [5, 10, 15, 20, 25, 30] as const; // время на вопрос
export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25, 30] as const; // кол. вопросов

// Лимиты
export const MIN_TIME_PER_QUESTION = 5;
export const MAX_TIME_PER_QUESTION = 30;
export const MIN_QUESTION_COUNT = 5;
export const MAX_QUESTION_COUNT = 30;
