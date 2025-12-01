
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HealthFormAddButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onAdd: () => void;
  buttonText: string;
}

export const HealthFormAddButton: React.FC<HealthFormAddButtonProps> = ({
  title,
  description,
  icon,
  onAdd,
  buttonText
}) => {
  return (
    <div className="border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 hover:border-amber-400 transition-all duration-300">
      <div className="text-center">
        <div className="h-8 w-8 text-amber-600 mx-auto mb-3 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-amber-800 mb-2">{title}</h3>
        <p className="text-amber-700 text-sm mb-4">{description}</p>
        <Button 
          onClick={onAdd} 
          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
