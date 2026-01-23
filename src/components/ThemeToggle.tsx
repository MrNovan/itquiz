import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center w-20 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      style={{
        backgroundColor: theme === 'light' ? '#87CEEB' : '#1e3a8a'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      
      <div className="absolute inset-0 rounded-full" />
      
     
      <div
        className={`relative inline-block w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-[52px]' : 'translate-x-1'
        }`}
      >
        {/* Иконка солнца */}
        <Sun
          className={`absolute inset-0 w-5 h-5 m-0.5 text-yellow-500 transition-opacity duration-300 ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Иконка луны */}
        <Moon
          className={`absolute inset-0 w-5 h-5 m-0.5 text-yellow-400 transition-opacity duration-300 ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      
      {/* Текст день/ночь */}
      <span
        className={`absolute text-xs font-medium text-white transition-opacity duration-300 ${
          theme === 'light' ? 'opacity-100 right-3' : 'opacity-0'
        }`}
      >
        DAY
      </span>
      <span
        className={`absolute text-xs font-medium text-white transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-100 left-3' : 'opacity-0'
        }`}
      >
        NIGHT
      </span>
    </button>
  );
};

export default ThemeToggle;