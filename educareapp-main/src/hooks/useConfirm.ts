
import { useState } from 'react';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
      setIsOpen(true);
      
      // For now, just return true after a brief delay
      // In a real implementation, this would show a modal dialog
      setTimeout(() => {
        resolve(window.confirm(`${options.title}\n\n${options.description}`));
        setIsOpen(false);
      }, 100);
    });
  };

  return {
    confirm,
    isOpen
  };
};
