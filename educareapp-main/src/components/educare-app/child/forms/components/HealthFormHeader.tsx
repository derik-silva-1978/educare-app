
import React from 'react';

interface HealthFormHeaderProps {
  title: string;
  description: string;
  progress: number;
  icon?: React.ReactNode;
}

export const HealthFormHeader: React.FC<HealthFormHeaderProps> = ({
  title,
  description,
  progress,
  icon
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 border-b border-amber-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-amber-100 text-sm mt-1">{description}</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-sm font-medium">{progress}% completo</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
