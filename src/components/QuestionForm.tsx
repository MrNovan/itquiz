import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Question, Category, Level } from '../types';
import ThemeToggle from './ThemeToggle';
import Header from './Header';

interface QuestionFormProps {
  question: Question | null;
  categories: Category[];
  levels: Level[];
  onSubmit: (questionData: Omit<Question, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question, 
  categories, 
  levels, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    category_id: question?.category_id || '',
    level_id: question?.level_id || '',
    text: question?.text || '',
    options: question?.options || ['', '', '', ''],
    correct_answer: question?.correct_answer || 0,
    explanation: question?.explanation || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.category_id || !formData.level_id || !formData.text.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      setError('Все варианты ответов должны быть заполнены');
      return;
    }

    if (!formData.explanation.trim()) {
      setError('Пояснение обязательно для заполнения');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <Header subtitle={question ? 'Редактировать вопрос' : 'Добавить новый вопрос'} />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категория *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Уровень *
                </label>
                <select
                  value={formData.level_id}
                  onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Выберите уровень</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Текст вопроса *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Введите текст вопроса..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Варианты ответов *
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={formData.correct_answer === index}
                      onChange={() => setFormData({ ...formData, correct_answer: index })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder={`Вариант ответа ${index + 1}`}
                      required
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20">
                      {formData.correct_answer === index ? 'Правильный' : ''}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Отметьте радиокнопку рядом с правильным ответом
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пояснение *
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Объясните, почему этот ответ правильный..."
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;