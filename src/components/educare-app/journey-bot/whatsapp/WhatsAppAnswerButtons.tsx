import React from 'react';
import { Button } from '@/components/ui/button';

interface WhatsAppAnswerButtonsProps {
  options: Array<{
    value: number;
    text: string;
    emoji: string;
  }>;
  onSelect: (value: number, text: string) => void;
}

const getButtonStyles = (value: number) => {
  switch (value) {
    case 1: // Sim
      return {
        base: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-500 shadow-lg hover:shadow-xl",
        hover: "hover:scale-[1.02] active:scale-[0.98]"
      };
    case 2: // Às vezes
      return {
        base: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-orange-500 shadow-lg hover:shadow-xl",
        hover: "hover:scale-[1.02] active:scale-[0.98]"
      };
    case 3: // Não
      return {
        base: "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white border-red-400 shadow-lg hover:shadow-xl",
        hover: "hover:scale-[1.02] active:scale-[0.98]"
      };
    default:
      return {
        base: "bg-white hover:bg-gray-50 text-gray-800 border-gray-200 shadow-sm hover:shadow-md",
        hover: "hover:scale-[1.01] active:scale-[0.99]"
      };
  }
};

export const WhatsAppAnswerButtons: React.FC<WhatsAppAnswerButtonsProps> = ({
  options,
  onSelect
}) => {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const styles = getButtonStyles(option.value);
        return (
          <Button
            key={option.value}
            onClick={() => onSelect(option.value, option.text)}
            className={`
              w-full rounded-xl py-4 px-5 text-left justify-start 
              transition-all duration-200 transform
              ${styles.base} ${styles.hover}
            `}
            variant="ghost"
          >
            <div className="flex items-center gap-4 w-full">
              <span className="text-xl drop-shadow-sm">{option.emoji}</span>
              <span className="text-sm font-semibold flex-1 drop-shadow-sm">{option.text}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};