import React, { useState } from 'react';
import { ArrowLeft, Clock, Hash, Save } from 'lucide-react';
import { QuizSettings } from '../types';
import ScrollToTop from './ScrollToTop';
import ThemeToggle from './ThemeToggle';
import Header from './Header';
import Footer from './Footer';

interface SettingsProps {
  settings: QuizSettings;
  onSave: (settings: QuizSettings) => void;
  onBack: () => void;
  onHomeClick?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onBack, onHomeClick }) => {
  const [timePerQuestion, setTimePerQuestion] = useState(settings.timePerQuestion);
  const [questionCount, setQuestionCount] = useState(settings.questionCount);

  const handleSave = () => {
    onSave({ timePerQuestion, questionCount });
  };

  const timeOptions = [5, 10, 15, 20, 25, 30];
  const questionOptions = [5, 10, 15, 20, 25, 30];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Переключение темы */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <Header onHomeClick={onHomeClick} />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Настройки квиза
          </h2>

          <div className="space-y-8">
            {/* Настройки таймера */}
            <div>
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Время на вопрос
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimePerQuestion(time)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      timePerQuestion === time
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {time} сек
                  </button>
                ))}
              </div>
            </div>

            {/* Настройки кол. вопросов */}
            <div>
              <div className="flex items-center mb-4">
                <Hash className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Количество вопросов
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {questionOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      questionCount === count
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {count} вопр.
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={onBack}
              className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить настройки
            </button>
          </div>
        </div>

        <Footer />
        
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Settings;