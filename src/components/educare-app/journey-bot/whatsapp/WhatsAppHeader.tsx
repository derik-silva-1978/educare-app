import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Baby, MessageCircle, Heart, User } from 'lucide-react';
import { TitiNautaAvatar } from '../TitiNautaAvatar';

interface WhatsAppHeaderProps {
  onBack: () => void;
  childName: string;
  ageRange: string;
  progress: number;
  currentDimension?: string;
  // Module count information
  currentQuestionInModule?: number;
  totalQuestionsInModule?: number;
  moduleName?: string;
}

const getDimensionIcon = (dimension?: string) => {
  switch (dimension) {
    case 'motor_grosso':
      return <Baby className="w-3 h-3" />;
    case 'motor_fino':
      return <User className="w-3 h-3" />;
    case 'linguagem':
      return <MessageCircle className="w-3 h-3" />;
    case 'cognitivo':
      return <Brain className="w-3 h-3" />;
    case 'social_emocional':
      return <Heart className="w-3 h-3" />;
    default:
      return null;
  }
};

const getDimensionName = (dimension?: string) => {
  switch (dimension) {
    case 'motor_grosso':
      return 'Motor Grosso';
    case 'motor_fino':
      return 'Motor Fino';
    case 'linguagem':
      return 'Linguagem';
    case 'cognitivo':
      return 'Cognitivo';
    case 'social_emocional':
      return 'Social-Emocional';
    case 'autocuidado':
      return 'Autocuidado';
    default:
      return '';
  }
};

export const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({
  onBack,
  childName,
  ageRange,
  progress,
  currentDimension,
  currentQuestionInModule = 0,
  totalQuestionsInModule = 0,
  moduleName = ''
}) => {
  const dimensionIcon = getDimensionIcon(currentDimension);
  const dimensionName = getDimensionName(currentDimension);

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center gap-3 rounded-t-3xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-white hover:bg-green-700/50 p-1 h-auto rounded-full transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* TitiNauta Avatar */}
      <div className="relative">
        <TitiNautaAvatar size="md" mood="happy" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      </div>

      {/* Bot Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">TitiNauta</h2>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="text-xs opacity-90">online</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs opacity-75">
            {childName} • {ageRange}
          </p>
          {dimensionIcon && (
            <div className="flex items-center gap-1 bg-green-700/30 px-2 py-0.5 rounded-full">
              {dimensionIcon}
              <span className="text-xs">{dimensionName}</span>
            </div>
          )}
        </div>
        {/* Simplified Module Info */}
        {moduleName && (
          <div className="mt-1">
            <span className="text-xs text-green-200/90 font-medium">
              {moduleName}
            </span>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="text-right">
        <div className="text-xs opacity-75 mb-1 font-medium">
          {Math.round(progress)}%
        </div>
        <div className="w-14 h-2 bg-green-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-green-300 to-green-200 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};