import { useState, useCallback } from 'react';
import { Question } from '../types';

export interface UseFiltersReturn {
  // Состояние фильтров
  searchTerm: string;
  filterCategory: string;
  filterLevel: string;
  
  // Сеттеры
  setSearchTerm: (term: string) => void;
  setFilterCategory: (categoryId: string) => void;
  setFilterLevel: (levelId: string) => void;
  
  // Функция фильтрации
  filterQuestions: (questions: Question[]) => Question[];
}

export function useFilters(): UseFiltersReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  const filterQuestions = useCallback((questions: Question[]): Question[] => {
    return questions.filter(question => {
      // Фильтр по поисковому запросу (регистронезависимый)
      const matchesSearch = !searchTerm || 
        question.text.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Фильтр по категории
      const matchesCategory = filterCategory === 'all' || 
        question.category_id === filterCategory;
      
      // Фильтр по уровню
      const matchesLevel = filterLevel === 'all' || 
        question.level_id === filterLevel;
      
      // AND логика - все условия должны выполняться
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, filterCategory, filterLevel]);

  return {
    searchTerm,
    filterCategory,
    filterLevel,
    setSearchTerm,
    setFilterCategory,
    setFilterLevel,
    filterQuestions
  };
}
