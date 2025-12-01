
import React, { useCallback, useState } from 'react';
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

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: 'Confirmação',
    description: 'Tem certeza?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    destructive: false,
  });
  const [resolve, setResolve] = useState<(value: boolean) => void>();
  
  const confirm = useCallback(
    (options: ConfirmOptions) => {
      return new Promise<boolean>((resolve) => {
        setOptions(options);
        setResolve(() => resolve);
        setOpen(true);
      });
    },
    []
  );
  
  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve(true);
    }
    setOpen(false);
  }, [resolve]);
  
  const handleCancel = useCallback(() => {
    if (resolve) {
      resolve(false);
    }
    setOpen(false);
  }, [resolve]);
  
  const ConfirmationDialog = useCallback(
    () => (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={options.destructive ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [open, options, handleConfirm, handleCancel]
  );
  
  return {
    confirm,
    ConfirmationDialog,
  };
}
