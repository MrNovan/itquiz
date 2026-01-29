import { useState, useEffect, useCallback } from 'react';
import { Question, Category, Level } from '../types';
import { QuizService } from '../services/quizService';
import { useErrorHandler } from './useErrorHandler';

export interface UseAdminDataReturn {
  // Данные
  questions: Question[];
  categories: Category[];
  levels: Level[];
  
  // Состояние
  loading: boolean;
  error: Error | null;
  
  // Методы
  loadData: () => Promise<void>;
  createQuestion: (data: Omit<Question, 'id' | 'created_at'>) => Promise<void>;
  updateQuestion: (id: string, data: Omit<Question, 'id' | 'created_at'>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  createCategory: (data: Omit<Category, 'created_at'>) => Promise<void>;
  updateCategory: (id: string, data: Omit<Category, 'created_at'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useAdminData(): UseAdminDataReturn {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const [questionsData, categoriesData, levelsData] = await Promise.all([
        QuizService.getAllQuestions(),
        QuizService.getCategories(),
        QuizService.getLevels()
      ]);
      
      setQuestions(questionsData);
      setCategories(categoriesData);
      setLevels(levelsData);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createQuestion = useCallback(async (data: Omit<Question, 'id' | 'created_at'>) => {
    await QuizService.createQuestion(data);
    await loadData();
  }, [loadData]);

  const updateQuestion = useCallback(async (id: string, data: Omit<Question, 'id' | 'created_at'>) => {
    await QuizService.updateQuestion(id, data);
    await loadData();
  }, [loadData]);

  const deleteQuestion = useCallback(async (id: string) => {
    await QuizService.deleteQuestion(id);
    await loadData();
  }, [loadData]);

  const createCategory = useCallback(async (data: Omit<Category, 'created_at'>) => {
    await QuizService.createCategory(data);
    await loadData();
  }, [loadData]);

  const updateCategory = useCallback(async (id: string, data: Omit<Category, 'created_at'>) => {
    await QuizService.updateCategory(id, data);
    await loadData();
  }, [loadData]);

  const deleteCategory = useCallback(async (id: string) => {
    await QuizService.deleteCategory(id);
    await loadData();
  }, [loadData]);

  return {
    questions,
    categories,
    levels,
    loading,
    error,
    loadData,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
