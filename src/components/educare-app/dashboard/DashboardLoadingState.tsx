
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface DashboardLoadingStateProps {
  message?: string;
}

const DashboardLoadingState: React.FC<DashboardLoadingStateProps> = ({ 
  message = "Carregando dados..." 
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardLoadingState;
