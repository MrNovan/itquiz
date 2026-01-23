const API_BASE_URL = '/api/quiz';
import { Category, Level, Question } from '../types';

export class QuizService {
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getLevels(): Promise<Level[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/levels`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch levels: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getQuestions(categoryId: string, levelId: string): Promise<Question[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/questions?categoryId=${categoryId}&levelId=${levelId}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // методы Админа
  static async getAllQuestions(): Promise<Question[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/all-questions`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch all questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async createQuestion(questionData: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData)
    });
    
    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        // Игнор ошибок JSON
      }
      throw new Error(`Failed to create question: ${errorMsg}`);
    }
  }

  static async updateQuestion(id: string, questionData: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData)
      });
      
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          // Игнор ошибок JSON
        }
        throw new Error(`Failed to update question: ${errorMsg}`);
      }
    } catch (error) {
      throw new Error(`Failed to update question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteQuestion(id: string): Promise<void> {
    console.log('Attempting to delete question with id:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      console.log('Question deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Управление категориями
  static async createCategory(categoryData: Omit<Category, 'created_at'>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      throw new Error(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateCategory(id: string, categoryData: Omit<Category, 'created_at'>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      throw new Error(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    console.log('Attempting to delete category with id:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      console.log('Category deleted successfully');
    } catch (error) {
      console.error('Delete category error:', error);
      throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}