
import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useSupabaseChildren } from '@/hooks/useSupabaseChildren';
import { DiaryTab } from '@/components/educare-app/child/DiaryTab';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/loading';
import { Skeleton } from '@/components/ui/skeleton';

// Child details skeleton loader
const ChildDetailsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
    </div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
  </div>
);

const ChildDiaryPosts: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { children, isLoading, isError, refreshListing } = useSupabaseChildren();
  
  // Find the child once data is loaded
  const child = children.find(c => c.id === childId);
  
  const handleRetry = () => {
    refreshListing();
    toast({
      title: "Atualizando dados",
      description: "Tentando recuperar informações da criança..."
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <ChildDetailsSkeleton />
      </div>
    );
  }
  
  if (!child) {
    return (
      <div className="container mx-auto p-6">
        <Card className="mx-auto max-w-md p-6">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Criança não encontrada</h3>
            <p className="text-muted-foreground mb-6">Não conseguimos encontrar os dados desta criança.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Tentar novamente
              </Button>
              <Button 
                onClick={() => navigate('/educare-app/children')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para lista
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  const fullName = `${child.first_name} ${child.last_name}`;
  
  return (
    <>
      <Helmet>
        <title>Diário - {fullName} | Educare</title>
      </Helmet>
      
      <div className="container mx-auto py-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/educare-app/children')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">Voltar</span>
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">{fullName}</h1>
            </div>
            <p className="text-sm text-muted-foreground">Registros diários de atividades e desenvolvimento</p>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <Spinner size="lg" text="Carregando registros do diário..." />
          </div>
        }>
          <DiaryTab childId={childId!} />
        </Suspense>
      </div>
    </>
  );
};

export default ChildDiaryPosts;
