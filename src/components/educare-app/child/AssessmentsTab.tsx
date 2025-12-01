
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

interface AssessmentsTabProps {
  childId: string;
}

export const AssessmentsTab: React.FC<AssessmentsTabProps> = ({ childId }) => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const isParent = hasRole('parent');
  
  // This would be API data in a real app
  const assessments = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Avaliações</h2>
        {isParent && (
          <Button onClick={() => navigate(`/educare-app/assessments/new?childId=${childId}`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        )}
      </div>
      
      {assessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* This would map through the assessments */}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <h3 className="text-lg font-medium mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-muted-foreground mb-6">
              {isParent 
                ? 'Realize a primeira avaliação para acompanhar o desenvolvimento da criança.' 
                : 'Aguarde que o responsável crie uma avaliação de desenvolvimento.'}
            </p>
            {isParent && (
              <Button onClick={() => navigate(`/educare-app/assessments/new?childId=${childId}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Iniciar Avaliação
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recursos de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-md">
                <ClipboardList className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h4 className="font-medium">Avaliação de Marcos do Desenvolvimento</h4>
                <p className="text-sm text-muted-foreground">
                  Avalie os marcos de desenvolvimento de acordo com a idade da criança.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary" size="sm">
                  Saiba mais
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-md">
                <Clock className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-medium">Acompanhamento Contínuo</h4>
                <p className="text-sm text-muted-foreground">
                  Realize avaliações periódicas para monitorar o progresso.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary" size="sm">
                  Saiba mais
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h4 className="font-medium">Compartilhamento Seguro</h4>
                <p className="text-sm text-muted-foreground">
                  Compartilhe os resultados com profissionais autorizados.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary" size="sm">
                  Saiba mais
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentsTab;
