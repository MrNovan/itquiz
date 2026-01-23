import { Brain } from 'lucide-react';

interface HeaderProps {
  subtitle?: string;
  onHomeClick?: () => void;
}

const Header = ({
  subtitle = "Проверь свои знания по фронтенду, бэкенду и DevOps!",
  onHomeClick
}: HeaderProps) => {
  const handleTitleClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <Brain className="w-12 h-12 text-pink-500 mr-3" />
        {onHomeClick ? (
          <button
            onClick={handleTitleClick}
            className="text-4xl font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            IT Квиз
          </button>
        ) : (
          <h1 className="text-4xl font-bold text-blue-500">IT Квиз</h1>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        {subtitle}
      </p>
    </div>
  );
};

export default Header;