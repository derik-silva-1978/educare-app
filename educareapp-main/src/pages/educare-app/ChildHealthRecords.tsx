
import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useSupabaseChildren } from '@/hooks/useSupabaseChildren';
import { HealthRecordsTab } from '@/components/educare-app/child/HealthRecordsTab';
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

const ChildHealthRecords: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { children, isLoading } = useSupabaseChildren();
  
  // Find the child once data is loaded
  const child = children.find(c => c.id === childId);
  
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
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-2">Criança não encontrada</h3>
            <p className="text-muted-foreground mb-4">Não conseguimos encontrar os dados desta criança.</p>
            <Button onClick={() => navigate('/educare-app/children')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const fullName = `${child.first_name} ${child.last_name}`;
  
  return (
    <>
      <Helmet>
        <title>Registros de Saúde - {fullName} | Educare</title>
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
            <p className="text-sm text-muted-foreground">Registros de saúde e desenvolvimento</p>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <Spinner size="lg" text="Carregando registros de saúde..." />
          </div>
        }>
          <HealthRecordsTab childId={childId!} />
        </Suspense>
      </div>
    </>
  );
};

export default ChildHealthRecords;
