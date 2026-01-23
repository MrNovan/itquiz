import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface CategoryFormProps {
  onSubmit: (category: { id: string; title: string; description: string }) => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
  };
}

export default function CategoryForm({ onSubmit, onCancel, initialData }: CategoryFormProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.title.trim() || !formData.description.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl max-w-md w-full p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {initialData ? 'Редактировать категорию' : 'Добавить категорию'}
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              ID категории
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={!!initialData}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="javascript, python, react..."
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Название
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="JavaScript, Python, React..."
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              placeholder="Описание категории..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {initialData ? 'Сохранить' : 'Добавить'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}