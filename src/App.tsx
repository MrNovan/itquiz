import { useState } from 'react';
import HomePage from './components/HomePage';
import LevelSelector from './components/LevelSelector';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Settings from './components/Settings';
import { QuizSettings, CategoryId, LevelId, Question } from './types';

type AppState = 'home' | 'level-select' | 'quiz' | 'results' | 'settings';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);
  const [settingsSource, setSettingsSource] = useState<AppState | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [completedQuizQuestions, setCompletedQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [settings, setSettings] = useState<QuizSettings>({
    timePerQuestion: 30,
    questionCount: 5
  });

  const handleCategorySelect = (category: CategoryId) => {
    setSelectedCategory(category);
    setCurrentState('level-select');
  };

  const handleLevelSelect = (level: LevelId) => {
    setSelectedLevel(level);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (score: number, total: number, questions: Question[], answers: number[]) => {
    setQuizScore(score);
    setTotalQuestions(total);
    setCompletedQuizQuestions(questions);
    setUserAnswers(answers);
    setCurrentState('results');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
    setSelectedCategory(null);
    setSelectedLevel(null);
    setCompletedQuizQuestions([]);
    setUserAnswers([]);
  };

  const handleBackToLevelSelect = () => {
    setCurrentState('level-select');
    setSelectedLevel(null);
  };

  const handleRestartQuiz = () => {
    setCurrentState('quiz');
  };

  const handleSettingsClick = () => {
    setSettingsSource(currentState);
    setCurrentState('settings');
  };

  const handleSettingsSave = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    // Возвращаемся туда, откуда пришли в настройки
    if (settingsSource && settingsSource !== 'settings') {
      setCurrentState(settingsSource);
    } else {
      // Если неизвестно откуда пришли, возвращаемся на главную
      setCurrentState('home');
    }
    setSettingsSource(null);
  };

  const handleSettingsBack = () => {
    if (selectedCategory) {
      setCurrentState('level-select');
    } else {
      setCurrentState('home');
    }
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'home':
        return <HomePage onCategorySelect={handleCategorySelect} onSettingsClick={handleSettingsClick} />;
      
      case 'level-select':
        return (
          <LevelSelector
            categoryId={selectedCategory!}
            settings={settings}
            onLevelSelect={handleLevelSelect}
            onBack={handleBackToHome}
            onSettingsClick={handleSettingsClick}
            onHomeClick={handleBackToHome}
          />
        );
      
      case 'quiz':
        return (
          <Quiz
            categoryId={selectedCategory!}
            levelId={selectedLevel!}
            settings={settings}
            onBack={handleBackToLevelSelect}
            onComplete={handleQuizComplete}
            onHomeClick={handleBackToHome}
          />
        );
      
      case 'results':
        return (
          <Results
            categoryId={selectedCategory!}
            levelId={selectedLevel!}
            score={quizScore}
            total={totalQuestions}
            questions={completedQuizQuestions}
            userAnswers={userAnswers}
            onRestart={handleRestartQuiz}
            onHome={handleBackToHome}
            onHomeClick={handleBackToHome}
          />
        );
      
      case 'settings':
        return (
          <Settings
            settings={settings}
            onSave={handleSettingsSave}
            onBack={handleSettingsBack}
            onHomeClick={handleBackToHome}
          />
        );
      
      default:
        return <HomePage onCategorySelect={handleCategorySelect} onSettingsClick={handleSettingsClick} />;
    }
  };

  return <div className="App">{renderCurrentState()}</div>;
}

export default App;