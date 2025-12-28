import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const ProfessionalWelcomeHero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = user?.name?.split(' ')[0] || 'Profissional';

  return (
    <Card className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 text-white border-0 shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-cyan-200" />
              <span className="text-sm font-medium text-cyan-100">Portal Profissional</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-lg text-cyan-100 max-w-md">
              Acompanhe o desenvolvimento das crianças sob sua orientação e acesse recursos de qualificação profissional.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/educare-app/professional/dashboard')}
              className="bg-white text-teal-700 hover:bg-cyan-50 font-semibold"
            >
              Ir para Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/educare-app/professional/children')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Users className="h-4 w-4 mr-2" />
              Gestão das Crianças
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalWelcomeHero;
