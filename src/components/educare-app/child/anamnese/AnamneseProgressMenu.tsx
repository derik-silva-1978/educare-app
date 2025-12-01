
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, Syringe, Baby, Eye } from 'lucide-react';

interface AnamneseProgressMenuProps {
  activeSection: string;
  completionPercentage: number;
  onSectionChange: (section: string) => void;
}

export const AnamneseProgressMenu: React.FC<AnamneseProgressMenuProps> = ({
  activeSection,
  completionPercentage,
  onSectionChange,
}) => {
  // Define the sections with their icons, labels, and color schemes
  const sections = [
    { 
      id: 'prenatal', 
      label: 'Pré-Natal', 
      icon: <Clipboard className="h-4 w-4" />,
      colors: {
        active: 'bg-gradient-to-br from-blue-500 to-teal-500',
        hover: 'hover:bg-gradient-to-br hover:from-blue-100 hover:to-teal-100',
        glow: 'shadow-blue-500/30'
      }
    },
    { 
      id: 'immunization', 
      label: 'Imunizações', 
      icon: <Syringe className="h-4 w-4" />,
      colors: {
        active: 'bg-gradient-to-br from-green-500 to-emerald-500',
        hover: 'hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100',
        glow: 'shadow-green-500/30'
      }
    },
    { 
      id: 'birth', 
      label: 'Nascimento', 
      icon: <Baby className="h-4 w-4" />,
      colors: {
        active: 'bg-gradient-to-br from-purple-500 to-pink-500',
        hover: 'hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100',
        glow: 'shadow-purple-500/30'
      }
    },
    { 
      id: 'tests', 
      label: 'Testes', 
      icon: <Eye className="h-4 w-4" />,
      colors: {
        active: 'bg-gradient-to-br from-orange-500 to-amber-500',
        hover: 'hover:bg-gradient-to-br hover:from-orange-100 hover:to-amber-100',
        glow: 'shadow-orange-500/30'
      }
    },
  ];

  // Determine progress indicator color based on percentage with higher contrast
  const getProgressColor = (percentage: number): string => {
    if (percentage < 30) return 'bg-red-600'; // Darker red for better contrast
    if (percentage < 70) return 'bg-amber-600'; // Darker amber for better contrast
    return 'bg-green-600'; // Darker green for better contrast
  };

  return (
    <div className="space-y-6">
      {/* Overall progress indicator with enhanced styling and contrast */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-medium">Progresso</span>
          <span className="font-semibold text-gray-900">{completionPercentage}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <Progress 
            value={completionPercentage} 
            className="h-2.5" 
            indicatorClassName={`${getProgressColor(completionPercentage)} progress-animate`}
          />
        </div>
      </div>

      {/* Enhanced navigation tabs with colored overlays */}
      <Tabs value={activeSection} onValueChange={onSectionChange}>
        <TabsList className="w-full grid grid-cols-4 h-auto bg-gray-100/80 backdrop-blur-sm p-1 rounded-lg">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={`
                  flex flex-col items-center py-3 gap-1 text-gray-700 font-medium
                  transition-all duration-300 ease-out relative overflow-hidden
                  rounded-md border border-transparent
                  ${isActive 
                    ? `${section.colors.active} text-white shadow-lg ${section.colors.glow} transform scale-[1.02]`
                    : `bg-white/60 hover:bg-white hover:shadow-md ${section.colors.hover} hover:scale-[1.01] hover:border-gray-200`
                  }
                  before:absolute before:inset-0 before:rounded-md
                  before:bg-gradient-to-br before:from-white/20 before:to-transparent 
                  before:opacity-0 before:transition-opacity before:duration-300
                  ${isActive ? 'before:opacity-100' : 'hover:before:opacity-50'}
                `}
              >
                <div className={`
                  transition-all duration-300 relative z-10
                  ${isActive ? 'transform scale-110' : ''}
                `}>
                  {section.icon}
                </div>
                <span className={`
                  text-xs relative z-10 transition-all duration-300
                  ${isActive ? 'font-semibold' : 'font-medium'}
                `}>
                  {section.label}
                </span>
                
                {/* Subtle glow effect for active state */}
                {isActive && (
                  <div className="absolute inset-0 rounded-md bg-gradient-to-br from-white/10 to-transparent animate-pulse" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AnamneseProgressMenu;
