
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuizImport from '@/components/admin/QuizImport';
import AdminQuizLayout from '@/components/admin/AdminQuizLayout';
import { useAdminAccessibility } from '@/hooks/accessibility/useAdminAccessibility';
import { ChevronLeft, Shield } from 'lucide-react';

const QuizAdmin: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  
  // Apply admin accessibility settings
  useAdminAccessibility();

  // Check if user is admin
  const isAuthorized = user && hasRole('admin');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
                <p className="text-muted-foreground mb-6">
                  Apenas administradores podem acessar esta área.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/educare-app/dashboard')}
                className="w-full"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Administração do Quiz - EduCare</title>
        <meta name="description" content="Gerencie questões e conteúdo do quiz" />
      </Helmet>
      
      <div className="admin-container">
        <AdminQuizLayout>
          <QuizImport />
        </AdminQuizLayout>
      </div>
    </>
  );
};

export default QuizAdmin;
