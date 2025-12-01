
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface NotificationFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({ 
  searchTerm, 
  onSearch 
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  // Apply search after typing stops
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setLocalSearch('');
    onSearch('');
  };
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar notificações..."
          value={localSearch}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      
      {localSearch && (
        <Button variant="ghost" onClick={handleClearSearch}>
          Limpar
        </Button>
      )}
    </div>
  );
};

export default NotificationFilters;
