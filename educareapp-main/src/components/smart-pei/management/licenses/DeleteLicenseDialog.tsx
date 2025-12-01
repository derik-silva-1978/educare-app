
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { License } from '@/types/license';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface DeleteLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License | null;
  onClose: () => void;
}

export const DeleteLicenseDialog: React.FC<DeleteLicenseDialogProps> = ({
  open,
  onOpenChange,
  license,
  onClose
}) => {
  const { deleteLicense } = useLicenseManagement();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!license) return;
    
    setIsDeleting(true);
    try {
      // Check if license has teams
      const hasTeams = license.teams && license.teams.length > 0;
      
      // Perform the deletion
      deleteLicense(license.id);
      
      // Show success toast with appropriate message
      toast({
        title: "Licença excluída",
        description: hasTeams 
          ? "A licença foi excluída e todas as equipes associadas foram removidas."
          : "A licença foi excluída com sucesso.",
        variant: "default",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao excluir licença",
        description: "Não foi possível excluir a licença. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const hasTeams = license?.teams && license.teams.length > 0;
  const isEnterprise = license?.model === 'enterprise';
  const assignedTo = license?.assignedTo;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir a licença com chave <strong>{license?.key && `${license.key.substring(0, 8)}...`}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {(hasTeams || assignedTo) && (
          <Alert variant="warning" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {hasTeams && (
                <p>Esta licença possui {license?.teams?.length} equipe(s) associada(s) que serão removidas.</p>
              )}
              {assignedTo && (
                <p className="mt-1">Esta licença está atribuída a <strong>{assignedTo}</strong> e esta atribuição será removida.</p>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLicenseDialog;
