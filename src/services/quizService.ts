import { Category, Level, Question } from '../types';
import { FetchOptions } from '../types/errors';
import { FetchWithRetry } from '../utils/fetchWithRetry';

const API_BASE_URL = '/api/quiz';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  retryConfig?: FetchOptions['retryConfig'];
}

export class QuizService {
  // Универсальный wrapper для всех API запросов
  private static async apiRequest<TResponse, TBody = unknown>(
    endpoint: string,
    options: ApiRequestOptions<TBody> = {}
  ): Promise<TResponse> {
    const { method = 'GET', body, retryConfig } = options;
    
    const fetchOptions: FetchOptions = {
      method,
      ...(body && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
      ...(retryConfig && { retryConfig }),
    };

    const response = await FetchWithRetry.fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    
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
    
    // Для DELETE/PUT/POST без тела ответа
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return undefined as TResponse;
    }
    
    return response.json();
  }

  static async getCategories(): Promise<Category[]> {
    return this.apiRequest<Category[]>('/categories');
  }

  static async getLevels(): Promise<Level[]> {
    return this.apiRequest<Level[]>('/levels');
  }

  static async getQuestions(categoryId: string, levelId: string): Promise<Question[]> {
    return this.apiRequest<Question[]>(`/questions?categoryId=${categoryId}&levelId=${levelId}`);
  }

  // методы Админа
  static async getAllQuestions(): Promise<Question[]> {
    return this.apiRequest<Question[]>('/all-questions');
  }

  static async createQuestion(questionData: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    return this.apiRequest('/questions', {
      method: 'POST',
      body: questionData,
      retryConfig: { maxRetries: 1 },
    });
  }

  static async updateQuestion(id: string, questionData: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    return this.apiRequest(`/questions/${id}`, {
      method: 'PUT',
      body: questionData,
      retryConfig: { maxRetries: 1 },
    });
  }

  static async deleteQuestion(id: string): Promise<void> {
    return this.apiRequest(`/questions/${id}`, {
      method: 'DELETE',
      retryConfig: { maxRetries: 1 },
    });
  }

  // Управление категориями
  static async createCategory(categoryData: Omit<Category, 'created_at'>): Promise<void> {
    return this.apiRequest('/categories', {
      method: 'POST',
      body: categoryData,
      retryConfig: { maxRetries: 1 },
    });
  }

  static async updateCategory(id: string, categoryData: Omit<Category, 'created_at'>): Promise<void> {
    return this.apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
      retryConfig: { maxRetries: 1 },
    });
  }

  static async deleteCategory(id: string): Promise<void> {
    return this.apiRequest(`/categories/${id}`, {
      method: 'DELETE',
      retryConfig: { maxRetries: 1 },
    });
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