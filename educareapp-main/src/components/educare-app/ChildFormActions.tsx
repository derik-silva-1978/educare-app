
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Save, Trash2, Loader2 } from 'lucide-react';

interface ChildFormActionsProps {
  isEditMode: boolean;
  isLoading: boolean;
  onDelete?: () => void;
  isDirty?: boolean;
}

const ChildFormActions: React.FC<ChildFormActionsProps> = ({
  isEditMode,
  isLoading,
  onDelete,
  isDirty = false
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      <div>
        {isEditMode && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Criança
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os dados da criança, incluindo 
                  avaliações e progresso, serão permanentemente excluídos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button 
                  variant="destructive" 
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    'Sim, Excluir'
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <div className="flex gap-3">
        <Button 
          type="submit"
          disabled={isLoading || (!isDirty && isEditMode)}
          className="gap-2 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? 'Salvando...' : 'Adicionando...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? 'Salvar Alterações' : 'Adicionar Criança'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChildFormActions;
