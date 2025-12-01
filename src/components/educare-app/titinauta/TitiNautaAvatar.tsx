import React from 'react';
import { Brain, Smile, Zap } from 'lucide-react';

type Mood = 'happy' | 'thinking' | 'excited' | 'neutral';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface TitiNautaAvatarProps {
  size?: Size;
  mood?: Mood;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const iconSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const moodIcons: Record<Mood, React.ReactNode> = {
  happy: <Smile className="w-full h-full" />,
  thinking: <Brain className="w-full h-full" />,
  excited: <Zap className="w-full h-full" />,
  neutral: <Brain className="w-full h-full opacity-60" />,
};

const moodColors: Record<Mood, string> = {
  happy: 'from-blue-400 to-purple-500',
  thinking: 'from-purple-400 to-indigo-500',
  excited: 'from-pink-400 to-rose-500',
  neutral: 'from-slate-400 to-slate-500',
};

export const TitiNautaAvatar: React.FC<TitiNautaAvatarProps> = ({
  size = 'md',
  mood = 'happy',
  className = '',
}) => {
  return (
    <div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${moodColors[mood]} flex items-center justify-center text-white shadow-lg ${className}`}
    >
      {moodIcons[mood]}
    </div>
  );
};

export default TitiNautaAvatar;
