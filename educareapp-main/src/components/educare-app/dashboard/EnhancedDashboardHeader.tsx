import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const EnhancedDashboardHeader: React.FC = () => {
  const { user } = useAuth();
  
  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const isParent = user?.role === 'parent';

  return (
    <Card className="bg-gradient-to-r from-blue-50 via-purple-50/60 to-green-50/40 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                {isParent 
                  ? 'Acompanhe o desenvolvimento das suas crianças de forma inteligente'
                  : 'Gerencie seus pacientes e avaliações profissionais'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex" asChild>
              <Link to="/educare-app">
                <Home className="h-4 w-4 mr-2" />
                Página Inicial
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden" asChild>
              <Link to="/educare-app">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDashboardHeader;