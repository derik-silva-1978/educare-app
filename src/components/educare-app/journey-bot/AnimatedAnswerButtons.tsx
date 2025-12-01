
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface AnimatedAnswerButtonsProps {
  onAnswer: (answer: 1 | 2 | 3) => void;
  disabled?: boolean;
}

const AnimatedAnswerButtons: React.FC<AnimatedAnswerButtonsProps> = ({
  onAnswer,
  disabled = false
}) => {
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const buttons = [
    {
      answer: 1 as const,
      text: 'Sim - Consegue fazer',
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
      textColor: 'text-white'
    },
    {
      answer: 2 as const,
      text: 'Não - Ainda não consegue',
      icon: XCircle,
      color: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
      textColor: 'text-white'
    },
    {
      answer: 3 as const,
      text: 'Não sei - Preciso observar',
      icon: HelpCircle,
      color: 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;
        
        return (
          <motion.div
            key={button.answer}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            custom={index}
          >
            <Button
              onClick={() => onAnswer(button.answer)}
              disabled={disabled}
              className={`${button.color} ${button.textColor} w-full py-4 px-6 text-lg font-semibold rounded-xl shadow-lg border-0 transition-all duration-300`}
              size="lg"
            >
              <IconComponent className="h-6 w-6 mr-3" />
              {button.text}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export { AnimatedAnswerButtons };
