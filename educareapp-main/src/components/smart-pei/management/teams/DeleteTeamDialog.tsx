
import React, { useState } from 'react';
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
} from '@/components/ui/alert-dialog';
import { LicenseTeam } from '@/types/license';
import { Spinner } from '@/components/ui/loading';

interface DeleteTeamDialogProps {
  team: LicenseTeam;
  open: boolean;
  onClose: () => void;
  onDelete: (teamId: string) => void;
  onOpenChange?: (open: boolean) => void;
}

const DeleteTeamDialog: React.FC<DeleteTeamDialogProps> = ({
  team,
  open,
  onClose,
  onDelete,
  onOpenChange
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete(team.id);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };
  
  return (
    <AlertDialog 
      open={open} 
      onOpenChange={openState => {
        if (onOpenChange) {
          onOpenChange(openState);
        }
        if (!openState) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Equipe</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a equipe "{team.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className="mr-2" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamDialog;
