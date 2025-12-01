import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, Plus } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface JourneyBotChildSelectorProps {
  children: Child[];
  isLoading?: boolean;
  onSelect: (childId: string) => void;
  onAddNew?: () => void;
}

export const JourneyBotChildSelector: React.FC<JourneyBotChildSelectorProps> = ({
  children,
  isLoading = false,
  onSelect,
  onAddNew
}) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando crianças...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Baby className="w-6 h-6" />
          Selecione uma Criança
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {children.map((child) => (
            <Button
              key={child.id}
              onClick={() => onSelect(child.id)}
              variant="outline"
              className="w-full h-auto flex items-center justify-between p-4 hover:bg-green-50 hover:border-green-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{child.name}</p>
                  <p className="text-sm text-gray-500">Nascido em: {new Date(child.birthDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        {onAddNew && (
          <Button
            onClick={onAddNew}
            variant="outline"
            className="w-full mt-6 flex items-center justify-center gap-2 border-dashed border-2 border-green-300 text-green-600 hover:bg-green-50"
          >
            <Plus className="w-5 h-5" />
            Adicionar Nova Criança
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
