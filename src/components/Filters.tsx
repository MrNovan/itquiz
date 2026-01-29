import { Search, Filter, Plus } from 'lucide-react';
import { Category, Level } from '../types';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterCategory: string;
  onCategoryChange: (categoryId: string) => void;
  filterLevel: string;
  onLevelChange: (levelId: string) => void;
  categories: Category[];
  levels: Level[];
  onAddClick: () => void;
  filteredCount: number;
  totalCount: number;
}

const Filters = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterLevel,
  onLevelChange,
  categories,
  levels,
  onAddClick,
  filteredCount,
  totalCount
}: FiltersProps) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по тексту вопроса..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Все категории</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Все уровни</option>
            {levels.map(level => (
              <option key={level.id} value={level.id}>
                {level.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить вопрос
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Найдено вопросов: {filteredCount} из {totalCount}
      </div>
    </>
  );
};

export default Filters;
