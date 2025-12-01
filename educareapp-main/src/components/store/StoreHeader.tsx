
import React from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface StoreHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="bg-gradient-to-b from-secondary/30 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="flex items-center mb-4">
              <Button asChild variant="ghost" size="sm" className="mr-2">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Link>
              </Button>
              <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground border-secondary/30">
                Loja Oficial
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Loja Educare+</h1>
            <p className="text-muted-foreground max-w-2xl">
              Conheça nossa linha de produtos, kits educacionais e assinaturas para educação inclusiva 
              e desenvolvimento infantil.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar produtos..." 
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHeader;
