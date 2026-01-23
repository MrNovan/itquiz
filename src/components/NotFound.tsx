import { Brain, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-16 h-16 text-pink-500 mr-4 animate-pulse" />
            <h1 className="text-5xl font-bold text-blue-500">IT Квиз</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-12 text-center">
          {/* 404 Анимация */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-gray-300 dark:text-gray-600 mb-4 animate-bounce">
              404
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full mb-6"></div>
          </div>

          {/* Сообщение ошибки */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Страница не найдена
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
              Упс! Похоже, вы попали на несуществующую страницу.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Возможно, ссылка устарела или была введена неправильно.
            </p>
          </div>

          {/* Кнопки навигации */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              На главную
            </button>
            
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </button>
          </div>

          {/* Интересный факт */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/30 dark:to-pink-900/30 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              💡 А знаете ли вы?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Код ошибки 404 означает "Not Found" и был впервые использован в 1992 году. 
              Название происходит от номера комнаты в CERN, где находился первый веб-сервер!
            </p>
          </div>
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 mt-8">
          © 2025 IT Квиз | Тестируй себя каждый день
        </footer>
        
        <ScrollToTop />
      </div>
    </div>
  );
};

export default NotFound;