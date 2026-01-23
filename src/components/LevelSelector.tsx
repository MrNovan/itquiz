import { useState, useEffect } from 'react';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { Level, LevelId, QuizSettings, CategoryId } from '../types';
import { QuizService } from '../services/quizService';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import Footer from './Footer';

interface LevelSelectorProps {
  categoryId: CategoryId;
  settings: QuizSettings;
  onLevelSelect: (levelId: LevelId) => void;
  onBack: () => void;
  onSettingsClick: () => void;
  onHomeClick?: () => void;
}

const LevelSelector = ({ categoryId, settings, onLevelSelect, onBack, onSettingsClick, onHomeClick }: LevelSelectorProps) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [levelsData, categoriesData] = await Promise.all([
          QuizService.getLevels(),
          QuizService.getCategories()
        ]);
        
        setLevels(levelsData);
        const selectedCategory = categoriesData.find(cat => cat.id === categoryId);
        setCategory(selectedCategory?.title || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  const getLevelColor = (levelId: string) => {
    switch (levelId) {
      case 'junior': return 'bg-green-500';
      case 'middle': return 'bg-yellow-500';
      case 'senior': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelDescription = (levelId: string) => {
    switch (levelId) {
      case 'junior': return 'Базовые вопросы для начинающих разработчиков';
      case 'middle': return 'Вопросы среднего уровня сложности';
      case 'senior': return 'Сложные вопросы для опытных специалистов';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Header subtitle="Загрузка уровней..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Header subtitle="Ошибка" />
          <p className="text-red-600 text-lg mt-4 text-center">
            Ошибка: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <Header onHomeClick={onHomeClick} />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Выберите уровень: {category}
          </h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-blue-700 dark:text-blue-300 text-center">
              <strong>Текущие настройки:</strong> {settings.timePerQuestion} сек на вопрос, {settings.questionCount} вопросов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900/50"
                onClick={() => onLevelSelect(level.id as LevelId)}
              >
                <div className={`w-4 h-4 rounded-full ${getLevelColor(level.id)} mx-auto mb-4`}></div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                  {level.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                  {getLevelDescription(level.id)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={onBack}
              className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </button>

            <button
              onClick={onSettingsClick}
              className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Настройки
            </button>
          </div>
        </div>

        <Footer />
        
        <ScrollToTop />
      </div>
    </div>
  );
};

export default LevelSelector;