import { useState, useEffect } from 'react';
import { RefreshCw, Home, Trophy, Target, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { CategoryId, LevelId, Question, Category } from '../types';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import Footer from './Footer';
import { QuizService } from '../services/quizService';

interface ResultsProps {
  categoryId: CategoryId;
  levelId: LevelId;
  score: number;
  total: number;
  questions: Question[];
  userAnswers: number[];
  onRestart: () => void;
  onHome: () => void;
  onHomeClick?: () => void;
}

const Results = ({ categoryId, levelId, score, total, questions, userAnswers, onRestart, onHome, onHomeClick }: ResultsProps) => {
  const percentage = Math.round((score / total) * 100);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await QuizService.getCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryTitle = () => {
    if (loading) return 'Загрузка...';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.title : 'Неизвестная категория';
  };

  const getLevelTitle = () => {
    switch (levelId) {
      case 'junior': return 'Джун';
      case 'middle': return 'Мидл';
      case 'senior': return 'Сеньер';
      default: return '';
    }
  };

  const getResultMessage = () => {
    if (percentage >= 80) {
      return { 
        message: 'Отлично!', 
        description: 'Вы показали превосходные знания!',
        icon: Trophy,
        color: 'text-green-500'
      };
    } else if (percentage >= 60) {
      return { 
        message: 'Хорошо!', 
        description: 'Неплохой результат, но есть куда расти!',
        icon: Target,
        color: 'text-yellow-500'
      };
    } else {
      return { 
        message: 'Нужно подучить!', 
        description: 'Рекомендуем повторить материал.',
        icon: AlertCircle,
        color: 'text-red-500'
      };
    }
  };

  const result = getResultMessage();
  const ResultIcon = result.icon;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <Header onHomeClick={onHomeClick} />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 mb-8">
          <div className="text-center mb-8">
            <ResultIcon className={`w-16 h-16 mx-auto mb-4 ${result.color}`} />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {result.message}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {result.description}
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Результат: {getCategoryTitle()} ({getLevelTitle()})
              </h3>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {score} из {total}
              </div>
              <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                {percentage}%
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Пройти снова
            </button>
            <button
              onClick={onHome}
              className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              На главную
            </button>
          </div>
        </div>

        {/* Подробный обзор вопросов */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Разбор вопросов
          </h3>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;
              const hasAnswer = userAnswer !== -1;
              
              return (
                <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        Вопрос {index + 1}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {question.text}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = optionIndex === question.correct_answer;
                      
                      let optionClass = 'p-3 rounded-lg border ';
                      
                      if (isCorrectAnswer) {
                        optionClass += 'border-green-500 bg-green-50 text-green-700';
                      } else if (isUserAnswer && !isCorrect) {
                        optionClass += 'border-red-500 bg-red-50 text-red-700';
                      } else {
                        optionClass += 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
                      }
                      
                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex items-center space-x-2">
                              {isCorrectAnswer && (
                                <span className="text-xs font-semibold text-green-600">
                                  Правильный ответ
                                </span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="text-xs font-semibold text-red-600">
                                  Ваш ответ
                                </span>
                              )}
                              {isUserAnswer && isCorrect && (
                                <span className="text-xs font-semibold text-green-600">
                                  Ваш ответ ✓
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!hasAnswer && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        <strong>Время истекло:</strong> Вы не успели ответить на этот вопрос
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Пояснение:</h5>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Footer />
        
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Results;