import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Question, QuizSettings, CategoryId, LevelId } from '../types';
import { QuizService } from '../services/quizService';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import Footer from './Footer';
import { ErrorFallback } from './ErrorFallback';
import { useErrorHandler } from '../hooks/useErrorHandler';
import QuizTimer from './QuizTimer';

interface QuizProps {
  categoryId: CategoryId;
  levelId: LevelId;
  settings: QuizSettings;
  onBack: () => void;
  onComplete: (score: number, total: number, questions: Question[], answers: number[]) => void;
  onHomeClick?: () => void;
}

const Quiz = ({ categoryId, levelId, settings, onBack, onComplete, onHomeClick }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();
  const [categoryTitle, setCategoryTitle] = useState('');
  const [levelTitle, setLevelTitle] = useState('');
  const [quizStarted, setQuizStarted] = useState(false); // Состояние начала квиза

  const loadQuizData = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const [questionsData, categoriesData, levelsData] = await Promise.all([
        QuizService.getQuestions(categoryId, levelId),
        QuizService.getCategories(),
        QuizService.getLevels()
      ]);

      // Перемешивание и ограничение вопросов  (настройки)
      const shuffledQuestions = QuizService.shuffleArray(questionsData);
      const limitedQuestions = shuffledQuestions.slice(0, Math.min(settings.questionCount, questionsData.length));
      setQuestions(limitedQuestions);

      // Установка заголовков
      const category = categoriesData.find(cat => cat.id === categoryId);
      const level = levelsData.find(lvl => lvl.id === levelId);
      setCategoryTitle(category?.title || '');
      setLevelTitle(level?.title || '');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId, levelId, settings.questionCount, clearError, handleError]);

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  const moveToNextQuestion = useCallback((answer: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);

    // Помечаем квиз как начатый после первого ответа
    if (currentQuestion === 0) {
      setQuizStarted(true);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsTimeUp(false);
    } else {
      // Квиз завершен
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct_answer ? 1 : 0);
      }, 0);
      onComplete(score, questions.length, questions, newAnswers);
    }
  }, [currentQuestion, userAnswers, onComplete, questions]);

  // Обработчик истечения времени (мемоизирован для стабильной ссылки)
  const handleTimeUp = useCallback(() => {
    if (!isTimeUp) {
      setIsTimeUp(true);
      moveToNextQuestion(-1);
    }
  }, [isTimeUp, moveToNextQuestion]);

  // Сброс isTimeUp при переходе к следующему вопросу
  useEffect(() => {
    setIsTimeUp(false);
  }, [currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    moveToNextQuestion(selectedAnswer ?? -1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Header subtitle="Загрузка вопросов..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Header subtitle="Ошибка" />
          <ErrorFallback error={error} onRetry={loadQuizData} />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Header subtitle="Вопросы не найдены для данной категории и уровня" />
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <Header onHomeClick={onHomeClick} />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
              Квиз: {categoryTitle} ({levelTitle})
            </h2>
            <p className="text-blue-500 text-center">
              Вопрос {currentQuestion + 1} из {questions.length}
            </p>
            <QuizTimer
              initialTime={settings.timePerQuestion}
              questionIndex={currentQuestion}
              onTimeUp={handleTimeUp}
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {currentQuestionData.text}
            </h3>

            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isTimeUp}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    isTimeUp
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      :
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            {/* Показываем кнопку "Назад" только на первом вопросе до начала квиза или при возврате на первый вопрос */}
            {(currentQuestion === 0 && !quizStarted) ? (
              <button
                onClick={onBack}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                К выбору уровня
              </button>
            ) : (
              <div className="invisible">
                {/* Заглушка для сохранения выравнивания */}
                <button className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg opacity-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  К выбору уровня
                </button>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null && !isTimeUp}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors duration-200 ${
                selectedAnswer !== null || isTimeUp
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        <Footer />
        
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Quiz;