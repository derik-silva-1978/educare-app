
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  text?: string;
}

export const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ className, isLoading, variant = 'default', size = 'default', text = 'Salvar', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'gap-2 min-w-[140px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-full',
          isLoading && 'cursor-not-allowed',
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {text}
          </>
        )}
      </Button>
    );
  }
);

SaveButton.displayName = 'SaveButton';
