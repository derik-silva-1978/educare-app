
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, AlertTriangle } from 'lucide-react';

const SuperAdminUserManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Usuários - Admin</title>
        <meta name="description" content="Administração de usuários do sistema" />
      </Helmet>
      
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/educare-app/dashboard')}
              className="hover:bg-muted"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
              <p className="text-muted-foreground">
                Administre usuários e permissões do sistema
              </p>
            </div>
          </div>
        </div>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Funcionalidade Temporariamente Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-amber-700">
                O sistema de gerenciamento de usuários está sendo reestruturado para melhor 
                performance e segurança. Esta funcionalidade estará disponível em breve.
              </p>
              <div className="flex items-center gap-2 text-amber-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">Usuários são gerenciados automaticamente através do sistema de autenticação</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SuperAdminUserManagement;
