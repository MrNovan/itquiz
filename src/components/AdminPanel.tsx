import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, Search, Filter, Folder, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Question, Category, Level } from '../types';
import { QuizService } from '../services/quizService';
import QuestionForm from './QuestionForm';
import CategoryForm from './CategoryForm';
import ConfirmModal from './ConfirmModal';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import { ErrorFallback } from './ErrorFallback';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AdminView = 'questions' | 'categories';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      clearError();
      const [questionsData, categoriesData, levelsData] = await Promise.all([
        QuizService.getAllQuestions(),
        QuizService.getCategories(),
        QuizService.getLevels()
      ]);
      
      setQuestions(questionsData);
      setCategories(categoriesData);
      setLevels(levelsData);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить вопрос',
      message: 'Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить.',
      onConfirm: async () => {
        try {
          console.log('Deleting question:', questionId);
          await QuizService.deleteQuestion(questionId);
          console.log('Question deleted, reloading data...');
          await loadData();
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (err) {
          console.error('Error deleting question:', err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
          toast.error(errorMessage);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      },
      type: 'danger'
    });
  };

  const handleFormSubmit = async (questionData: Omit<Question, 'id' | 'created_at'>) => {
    try {
      if (editingQuestion) {
        await QuizService.updateQuestion(editingQuestion.id, questionData);
      } else {
        await QuizService.createQuestion(questionData);
      }
      setShowForm(false);
      setEditingQuestion(null);
      await loadData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save question';
      toast.error(errorMessage);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
    setEditingCategory(null);
  };

  const getCategoryTitle = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.title || categoryId;
  };

  const getLevelTitle = (levelId: string) => {
    return levels.find(level => level.id === levelId)?.title || levelId;
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || question.category_id === filterCategory;
    const matchesLevel = filterLevel === 'all' || question.level_id === filterLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Category management handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить категорию',
      message: 'Вы уверены, что хотите удалить эту категорию? Это возможно только если в ней нет вопросов. Это действие нельзя отменить.',
      onConfirm: async () => {
        try {
          console.log('Deleting category:', categoryId);
          await QuizService.deleteCategory(categoryId);
          console.log('Category deleted, reloading data...');
          await loadData();
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (err) {
          console.error('Error deleting category:', err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
          toast.error(errorMessage);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      },
      type: 'danger'
    });
  };

  const handleCategoryFormSubmit = async (categoryData: Omit<Category, 'created_at'>) => {
    try {
      if (editingCategory) {
        await QuizService.updateCategory(editingCategory.id, categoryData);
      } else {
        await QuizService.createCategory(categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
      await loadData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save category';
      toast.error(errorMessage);
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Header subtitle="Админ панель" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-4 text-center">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Header subtitle="Админ панель" />
          <ErrorFallback error={error} onRetry={loadData} />
        </div>
      </div>
    );
  }


  if (showForm) {
    if (currentView === 'categories') {
      return (
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleCategoryFormSubmit}
          onCancel={handleFormCancel}
        />
      );
    }
    
    return (
      <QuestionForm
        question={editingQuestion}
        categories={categories}
        levels={levels}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
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
              onClick={() => navigate('/')}
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
              onClick={() => setCurrentView('questions')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'questions'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Вопросы ({questions.length})
            </button>
            <button
              onClick={() => setCurrentView('categories')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentView === 'categories'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Folder className="w-4 h-4 mr-2" />
              Категории ({categories.length})
            </button>
          </div>

          {currentView === 'questions' && (
          <>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по тексту вопроса..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
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
                onChange={(e) => setFilterLevel(e.target.value)}
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
              onClick={currentView === 'questions' ? handleAddQuestion : handleAddCategory}
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              {currentView === 'questions' ? 'Добавить вопрос' : 'Добавить категорию'}
            </button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {currentView === 'questions' 
              ? `Найдено вопросов: ${filteredQuestions.length} из ${questions.length}`
              : `Всего категорий: ${categories.length}`
            }
          </div>
          </>
          )}

          {currentView === 'categories' && (
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddCategory}
                className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {currentView === 'questions' && (
          filteredQuestions.map((question) => (
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
                    onClick={() => handleEditQuestion(question)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
                        <span className="text-xs font-semibold text-green-600">
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
          ))
          )}

          {currentView === 'categories' && (
            categories.map((category) => (
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
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Вопросов в категории: {questions.filter(q => q.category_id === category.id).length}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {currentView === 'questions' && filteredQuestions.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Вопросы не найдены</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Попробуйте изменить фильтры или добавить новый вопрос
            </p>
          </div>
        )}

        {currentView === 'categories' && categories.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Категории не найдены</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Добавьте первую категорию для начала работы
            </p>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
        type={confirmModal.type}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default AdminPanel;