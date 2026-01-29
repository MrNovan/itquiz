import { LogOut, FileText, Folder, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Header from './Header';

interface AdminHeaderProps {
  currentView: 'questions' | 'categories';
  onViewChange: (view: 'questions' | 'categories') => void;
  questionsCount: number;
  categoriesCount: number;
  onLogout: () => void;
  onNavigateHome: () => void;
}

const AdminHeader = ({
  currentView,
  onViewChange,
  questionsCount,
  categoriesCount,
  onLogout,
  onNavigateHome
}: AdminHeaderProps) => {
  return (
    <>
      {/* Переключение темы */}
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>
      
      <div className="text-center mb-8">
        <Header subtitle="Админ панель" />
      </div>

      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateHome}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            На главную
          </button>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => onViewChange('questions')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentView === 'questions'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Вопросы ({questionsCount})
          </button>
          <button
            onClick={() => onViewChange('categories')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentView === 'categories'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Folder className="w-4 h-4 mr-2" />
            Категории ({categoriesCount})
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
