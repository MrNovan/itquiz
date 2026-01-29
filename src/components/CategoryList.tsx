import { Plus, Edit, Trash2 } from 'lucide-react';
import { Category, Question } from '../types';

interface CategoryListProps {
  categories: Category[];
  questions: Question[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onAdd: () => void;
}

const CategoryList = ({ categories, questions, onEdit, onDelete, onAdd }: CategoryListProps) => {
  const getQuestionCount = (categoryId: string): number => {
    return questions.filter(q => q.category_id === categoryId).length;
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Категории не найдены</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Добавьте первую категорию для начала работы
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={onAdd}
          className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                    ID: {category.id}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Вопросов в категории: {getQuestionCount(category.id)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
