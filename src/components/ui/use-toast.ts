
// Minimal implementation of use-toast hook
import { useState } from 'react';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'foreground' | 'background';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  variant?: 'default' | 'destructive' | null;
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, type = 'default', duration = 3000, variant, action }: ToastOptions) => {
    // Map variant to type if provided
    const effectiveType = variant === 'destructive' ? 'error' : (type || 'default');
    
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      title,
      description,
      type: effectiveType,
      duration,
      action,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  };

  return {
    toast,
    toasts,
    dismiss: (toastId: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    },
  };
}
