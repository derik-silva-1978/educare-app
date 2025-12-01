
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, MapPin } from 'lucide-react';

interface ChildCardProps {
  child: {
    id: string;
    first_name: string;
    last_name: string;
    birthdate: string;
    age: number;
    ageFormatted?: string; // Idade formatada inteligentemente
    city?: string;
    observations?: string;
  };
  onCardClick: (id: string) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onCardClick }) => {
  const fullName = `${child.first_name || ''} ${child.last_name || ''}`.trim();
  const formattedBirthdate = new Date(child.birthdate).toLocaleDateString('pt-BR');
  
  const handleClick = () => {
    onCardClick(child.id);
  };

  return (
    <Card 
      className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-primary/40 dark:hover:border-primary/40 transition-all hover:shadow-md bg-white dark:bg-slate-900 cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {fullName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {child.ageFormatted || `${child.age} ${child.age === 1 ? 'ano' : 'anos'}`}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Nascimento:</span>
            <span className="font-medium">{formattedBirthdate}</span>
          </div>
          
          {child.city && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-3 w-3" />
              <span>{child.city}</span>
            </div>
          )}
        </div>
        
        {child.observations && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {child.observations}
          </p>
        )}
        
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button 
            variant="outline"
            className="w-full justify-center py-2 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(child.id);
            }}
          >
            <User className="h-4 w-4 mr-2" />
            Ver Perfil
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(ChildCard);
