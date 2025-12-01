
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  resultsCount?: number;
  totalCount?: number;
  className?: string;
}

export const StudentSearchBar: React.FC<StudentSearchBarProps> = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Buscar estudantes...",
  resultsCount,
  totalCount,
  className = ""
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  // Debounce the input value to avoid too many renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value]);
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`relative transition-all duration-200 ${inputFocused ? 'ring-2 ring-ring ring-offset-2' : ''}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8 pr-8"
          value={value}
          onChange={onChange}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
        {value && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {debouncedValue && resultsCount !== undefined && totalCount !== undefined && (
        <div className="text-xs text-muted-foreground mt-1">
          Exibindo {resultsCount} de {totalCount} estudantes
        </div>
      )}
    </div>
  );
};

export default StudentSearchBar;
