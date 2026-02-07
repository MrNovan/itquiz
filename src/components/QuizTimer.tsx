import { useState, useEffect, useCallback, memo } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  initialTime: number;
  questionIndex: number; // Для сброса таймера при смене вопроса
  onTimeUp: () => void;
}

const QuizTimer = memo(({ initialTime, questionIndex, onTimeUp }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Сброс таймера при смене вопроса
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [questionIndex, initialTime]);

  // Логика таймера
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  const getTimeColor = useCallback(() => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-yellow-500';
    return 'text-green-500';
  }, [timeLeft]);

  return (
    <div className="flex items-center justify-center mt-4">
      <Clock className={`w-5 h-5 mr-2 ${getTimeColor()}`} />
      <span className={`text-lg font-semibold ${getTimeColor()}`}>
        {timeLeft} сек
      </span>
    </div>
  );
});

QuizTimer.displayName = 'QuizTimer';

export default QuizTimer;
