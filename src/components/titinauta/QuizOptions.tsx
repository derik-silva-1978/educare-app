import React from 'react';
import { QuizOption } from '@/types/titinauta';

interface QuizOptionsProps {
  options: QuizOption[];
  onSelect: (option: QuizOption) => void;
}

const QuizOptions: React.FC<QuizOptionsProps> = ({ options, onSelect }) => {
  return (
    <div className="quiz-options">
      {options.map((option) => (
        <button
          key={option.id}
          className="quiz-option"
          onClick={() => onSelect(option)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default QuizOptions;
