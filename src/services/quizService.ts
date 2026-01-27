import { Category, Level, Question } from '../types';
import { FetchWithRetry } from '../utils/fetchWithRetry';

const API_BASE_URL = '/api/quiz';

export class QuizService {
  // Приватный метод для обработки ответов
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        // Игнорируем ошибки парсинга JSON
      }
      throw new Error(errorMsg);
    }
    return response.json();
  }

  static async getCategories(): Promise<Category[]> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/categories`);
    return this.handleResponse<Category[]>(response);
  }

  static async getLevels(): Promise<Level[]> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/levels`);
    return this.handleResponse<Level[]>(response);
  }

  static async getQuestions(categoryId: string, levelId: string): Promise<Question[]> {
    const response = await FetchWithRetry.fetch(
      `${API_BASE_URL}/questions?categoryId=${categoryId}&levelId=${levelId}`
    );
    return this.handleResponse<Question[]>(response);
  }

  // методы Админа
  static async getAllQuestions(): Promise<Question[]> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/all-questions`);
    return this.handleResponse<Question[]>(response);
  }

  static async createQuestion(questionData: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
      retryConfig: { maxRetries: 1 }
    });
    await this.handleResponse<void>(response);
  }

  static async updateQuestion(id: string, questionData: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
      retryConfig: { maxRetries: 1 }
    });
    await this.handleResponse<void>(response);
  }

  static async deleteQuestion(id: string): Promise<void> {
    console.log('Attempting to delete question with id:', id);
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
      retryConfig: { maxRetries: 1 }
    });
    await this.handleResponse<void>(response);
    console.log('Question deleted successfully');
  }

  // Управление категориями
  static async createCategory(categoryData: Omit<Category, 'created_at'>): Promise<void> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
      retryConfig: { maxRetries: 1 }
    });
    await this.handleResponse<void>(response);
  }

  static async updateCategory(id: string, categoryData: Omit<Category, 'created_at'>): Promise<void> {
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
      retryConfig: { maxRetries: 1 }
    });
    await this.handleResponse<void>(response);
  }

  static async deleteCategory(id: string): Promise<void> {
    console.log('Attempting to delete category with id:', id);
    const response = await FetchWithRetry.fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      retryConfig: { maxRetries: 1 }
    });
    await this.handleResponse<void>(response);
    console.log('Category deleted successfully');
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