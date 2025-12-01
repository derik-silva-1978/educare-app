
import React from 'react';
import { PEI } from '@/hooks/usePEI';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PEIGoalsFormProps {
  pei: PEI;
  onUpdate: (data: any) => void;
}

const PEIGoalsForm: React.FC<PEIGoalsFormProps> = ({ pei, onUpdate }) => {
  const { toast } = useToast();
  
  const handleAddGoal = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A adição de objetivos será disponibilizada em breve.',
      variant: 'default'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Objetivos do PEI</h3>
        <p className="text-muted-foreground mb-4">
          Defina os objetivos de aprendizagem e desenvolvimento para este PEI.
        </p>
        
        {pei.goals && pei.goals.length > 0 ? (
          <div className="space-y-4">
            {pei.goals.map((goal, index) => (
              <div key={goal.id || index} className="p-4 border rounded-lg">
                <h4 className="font-medium">{goal.title}</h4>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border rounded-lg bg-muted/10">
            <p className="text-muted-foreground mb-4">
              Esta funcionalidade estará disponível em breve. Por enquanto, os objetivos 
              podem ser adicionados após a criação do PEI na tela de visualização.
            </p>
            <Button variant="outline" onClick={handleAddGoal}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Objetivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PEIGoalsForm;
