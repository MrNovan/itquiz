import { useState, useEffect } from 'react';
import { Category, CategoryId } from '../types';
import { QuizService } from '../services/quizService';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import Footer from './Footer';

interface HomePageProps {
  onCategorySelect: (category: CategoryId) => void;
  onSettingsClick: () => void;
}

const HomePage = ({ onCategorySelect }: HomePageProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await QuizService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Header subtitle="Загрузка..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Header subtitle="Загрузка..." />
            <p className="text-red-600 text-lg mt-4">
              Ошибка: {error}
            </p>
            <p className="text-gray-600 mt-2">
              Пожалуйста, подключите базу данных
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl dark:shadow-gray-900/50"
              onClick={() => onCategorySelect(category.id)}
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                {category.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        <Footer />
        
        <ScrollToTop />
      </div>
    </div>
  );
};

export default HomePage;