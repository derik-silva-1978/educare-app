
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Save, Check, Loader2 } from 'lucide-react';

interface AssessmentFormFooterProps {
  onSave: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  progress: number;
}

export const AssessmentFormFooter: React.FC<AssessmentFormFooterProps> = ({
  onSave,
  onSubmit,
  isSubmitting,
  progress
}) => {
  const isComplete = progress === 100;
  
  return (
    <div className="flex justify-between w-full">
      <Button variant="outline" onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Salvar Progresso
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            disabled={isSubmitting || progress === 0}
            className={isComplete ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {isComplete ? "Finalizar Avaliação" : "Salvar e Finalizar"}
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isComplete ? "Finalizar avaliação?" : "Avaliação não está completa"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isComplete 
                ? "Ao finalizar esta avaliação, você não poderá mais editá-la. Confirma que deseja finalizar?"
                : `Esta avaliação está ${progress}% completa. Ainda existem itens não avaliados. Deseja finalizar mesmo assim?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit}>
              {isComplete ? "Finalizar Avaliação" : "Finalizar Mesmo Assim"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentFormFooter;
