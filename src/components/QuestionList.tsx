import { Edit, Trash2 } from 'lucide-react';
import { Question, Category, Level } from '../types';

interface QuestionListProps {
  questions: Question[];
  categories: Category[];
  levels: Level[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

const QuestionList = ({
  questions,
  categories,
  levels,
  onEdit,
  onDelete
}: QuestionListProps) => {
  const getCategoryTitle = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.title || categoryId;
  };

  const getLevelTitle = (levelId: string): string => {
    return levels.find(level => level.id === levelId)?.title || levelId;
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Вопросы не найдены</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Попробуйте изменить фильтры или добавить новый вопрос
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {getCategoryTitle(question.category_id)}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                  {getLevelTitle(question.level_id)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                {question.text}
              </h3>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(question)}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(question.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  index === question.correct_answer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {index === question.correct_answer && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      Правильный ответ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {question.explanation && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Пояснение:</h5>
              <p className="text-blue-700 dark:text-blue-300 text-sm">{question.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
