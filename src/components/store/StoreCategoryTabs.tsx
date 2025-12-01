
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryTabsProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const StoreCategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  sortOption,
  setSortOption
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full rounded-xl bg-muted/50 p-1">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-xs sm:text-sm md:text-base"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex items-center w-full md:w-auto">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Destaque</SelectItem>
            <SelectItem value="price-asc">Menor Preço</SelectItem>
            <SelectItem value="price-desc">Maior Preço</SelectItem>
            <SelectItem value="rating">Melhor Avaliação</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StoreCategoryTabs;
