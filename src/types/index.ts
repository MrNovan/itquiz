export * from './errors';

export interface Category {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

export interface Level {
  id: string;
  title: string;
  order_index: number;
  created_at?: string;
}

export interface Question {
  id: string;
  category_id: string;
  level_id: string;
  text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  created_at?: string;
}

export type CategoryId = string;
export type LevelId = 'junior' | 'middle' | 'senior';

export interface QuizSettings {
  timePerQuestion: number;
  questionCount: number;
}