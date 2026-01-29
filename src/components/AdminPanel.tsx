import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, Category } from '../types';
import QuestionForm from './QuestionForm';
import CategoryForm from './CategoryForm';
import ConfirmModal from './ConfirmModal';
import Header from './Header';
import { ErrorFallback } from './ErrorFallback';
import { useAdminData } from '../hooks/useAdminData';
import { useFilters } from '../hooks/useFilters';
import AdminHeader from './AdminHeader';
import Filters from './Filters';
import QuestionList from './QuestionList';
import CategoryList from './CategoryList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AdminView = 'questions' | 'categories';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>('questions');
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  // Используем кастомные хуки
  const {
    questions,
    categories,
    levels,
    loading,
    error,
    loadData,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createCategory,
    updateCategory,
    deleteCategory
  } = useAdminData();

  const {
    searchTerm,
    filterCategory,
    filterLevel,
    setSearchTerm,
    setFilterCategory,
    setFilterLevel,
    filterQuestions
  } = useFilters();

  // Применяем фильтрацию
  const filteredQuestions = filterQuestions(questions);

  // Обработчики для вопросов
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
          await deleteQuestion(questionId);
          console.log('Question deleted successfully');
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
        await updateQuestion(editingQuestion.id, questionData);
      } else {
        await createQuestion(questionData);
      }
      setShowForm(false);
      setEditingQuestion(null);
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

  // Обработчики для категорий
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
          await deleteCategory(categoryId);
          console.log('Category deleted successfully');
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
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save category';
      toast.error(errorMessage);
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  // Состояния загрузки и ошибок
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

  // Отображение форм
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

  // Главный UI
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <AdminHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          questionsCount={questions.length}
          categoriesCount={categories.length}
          onLogout={onLogout}
          onNavigateHome={handleNavigateHome}
        />

        {currentView === 'questions' && (
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            filterLevel={filterLevel}
            onLevelChange={setFilterLevel}
            categories={categories}
            levels={levels}
            onAddClick={handleAddQuestion}
            filteredCount={filteredQuestions.length}
            totalCount={questions.length}
          />
        )}

        {currentView === 'questions' && (
          <QuestionList
            questions={filteredQuestions}
            categories={categories}
            levels={levels}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
          />
        )}

        {currentView === 'categories' && (
          <CategoryList
            categories={categories}
            questions={questions}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onAdd={handleAddCategory}
          />
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