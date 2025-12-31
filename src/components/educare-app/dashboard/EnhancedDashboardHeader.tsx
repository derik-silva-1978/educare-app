import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { IconToolbar } from '@/components/educare-app/welcome';

interface EnhancedDashboardHeaderProps {
  childAgeMonths?: number;
}

const EnhancedDashboardHeader: React.FC<EnhancedDashboardHeaderProps> = ({ childAgeMonths }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const isParent = user?.role === 'parent' || (user?.role as string) === 'user';

  return (
    <Card className="bg-gradient-to-r from-blue-50 via-purple-50/60 to-green-50/40 dark:from-blue-950/50 dark:via-purple-950/30 dark:to-green-950/20 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuário'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
                {isParent 
                  ? 'Acompanhe o desenvolvimento das suas crianças'
                  : 'Gerencie seus pacientes e avaliações'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button variant="outline" size="sm" asChild>
                <Link to="/educare-app/welcome">
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Link>
              </Button>
            </div>
            <IconToolbar 
              messageCount={2}
              childAgeMonths={childAgeMonths}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDashboardHeader;
