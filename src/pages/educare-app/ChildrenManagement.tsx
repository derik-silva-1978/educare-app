
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ChildrenList from '@/components/educare-app/ChildrenList';

// Lazy-load less critical components
const ScrollToTopButton = React.lazy(() => import('@/components/educare-app/ScrollToTopButton'));

const ChildrenManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { children, isLoading, isError, refreshListing } = useCustomChildren();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Memoize filtered children to prevent unnecessary re-renders
  const filteredChildren = React.useMemo(() => {
    return children.filter(child => 
      `${child.first_name} ${child.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [children, searchTerm]);

  // Simplified navigation - single handler for child clicks
  const handleChildClick = useCallback((childId: string) => {
    navigate(`/educare-app/child/${childId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    refreshListing();
    toast({
      title: "Atualizando dados",
      description: "Tentando recuperar informações das crianças..."
    });
  }, [refreshListing, toast]);

  const handleAddChild = useCallback(() => {
    navigate('/educare-app/child/new');
  }, [navigate]);

  // Clear search term when component unmounts
  useEffect(() => {
    return () => {
      setSearchTerm('');
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Crianças | Educare</title>
      </Helmet>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-900/20 -z-10"></div>
        
        {/* Simplified background pattern */}
        <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary/60" />
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-purple-400/60" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>

        <div className="container mx-auto py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Crianças
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Acompanhe, avalie e monitore o desenvolvimento infantil de forma personalizada.
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className={`relative flex-grow sm:max-w-xs transition-all ${
                isSearchFocused 
                  ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/10' 
                  : 'ring-1 ring-gray-200 dark:ring-gray-800'
              } rounded-full overflow-hidden bg-white dark:bg-gray-950`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200">
                  <Search className={`${isSearchFocused ? 'text-primary' : ''} h-4 w-4`} />
                </div>
                <Input
                  placeholder="Buscar criança..."
                  className="pl-9 pr-3 border-0 rounded-full h-10 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setSearchTerm('')}
                    aria-label="Limpar busca"
                  >
                    <span className="sr-only">Limpar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
              
              <Button 
                onClick={handleAddChild} 
                className="w-full sm:w-auto gap-1.5 rounded-full px-5 py-2.5 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                <Plus className="h-4 w-4" />
                Adicionar Criança
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pb-12 px-4">
        {searchTerm && filteredChildren.length === 0 && !isLoading && !isError && (
          <Card className="p-6 text-center mb-6 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-gray-600 dark:text-gray-300">
              Nenhuma criança encontrada para "<span className="font-medium">{searchTerm}</span>".
            </p>
            <Button
              variant="link"
              onClick={() => setSearchTerm('')}
              className="mt-2"
            >
              Limpar pesquisa
            </Button>
          </Card>
        )}
        
        {searchTerm && filteredChildren.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-medium">{filteredChildren.length}</span> {filteredChildren.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"
          </p>
        )}
        
        <ChildrenList 
          children={filteredChildren} 
          isLoading={isLoading} 
          isError={isError}
          onChildClick={handleChildClick}
          onRetry={handleRetry}
          onAddChild={handleAddChild}
        />
        
        {!isLoading && !isError && children.length > 5 && (
          <Suspense fallback={null}>
            <ScrollToTopButton />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default ChildrenManagement;
