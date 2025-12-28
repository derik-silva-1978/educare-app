import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useProfessionalChildren } from '@/hooks/useProfessionalChildren';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { useContentItems } from '@/hooks/useContentItems';
import { 
  Users, UserPlus, Clock, ArrowRight, Baby, GraduationCap, Calendar, Activity, TrendingUp
} from 'lucide-react';

const calculateAge = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} dias`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    if (remainingMonths > 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
};

const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { pendingCount: chatInvitesPendingCount } = useTeamInvites();
  const { childrenAccess, isLoading } = useProfessionalChildren();
  const { user } = useAuth();
  
  const { items: qualificationItems, isLoading: qualificationLoading } = useContentItems({ 
    audience: 'professionals' 
  });
  
  const totalQualificationContent = qualificationItems.filter(
    item => item.type === 'training' || item.type === 'course'
  ).length;
  
  const assignedChildren = childrenAccess.filter(child => child.status === 'approved');
  const pendingInvitations = childrenAccess.filter(child => child.status === 'pending');

  const recentChildren = assignedChildren.slice(0, 3);
  
  return (
    <>
      <Helmet>
        <title>Dashboard Profissional | Educare</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name || 'Profissional'}
            </p>
          </div>
          <Button onClick={() => navigate('/educare-app/settings')} variant="outline">
            Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Crianças Ativas</p>
                  <p className="text-3xl font-bold mt-1">{assignedChildren.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Baby className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Convites Pendentes</p>
                  <p className="text-3xl font-bold mt-1">{pendingInvitations.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserPlus className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Convites de Equipe</p>
                  <p className="text-3xl font-bold mt-1">{chatInvitesPendingCount}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Qualificação</p>
                  <p className="text-3xl font-bold mt-1">{totalQualificationContent}</p>
                  <p className="text-xs text-indigo-100 mt-0.5">Conteúdos disponíveis</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Baby className="h-5 w-5 text-primary" />
                  Crianças em Acompanhamento
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-primary"
                  onClick={() => navigate('/educare-app/professional/children')}
                >
                  Ver Todas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Suas crianças mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : recentChildren.length > 0 ? (
                <div className="space-y-3">
                  {recentChildren.map((child) => (
                    <div
                      key={child.childId}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/educare-app/professional/children')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Baby className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{child.childName}</p>
                          <p className="text-sm text-muted-foreground">
                            {calculateAge(child.birthDate)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Ativo
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Nenhuma criança atribuída ainda</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    As crianças serão adicionadas quando os responsáveis enviarem convites
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Acesso Rápido
                </CardTitle>
              </div>
              <CardDescription>Navegue para os módulos principais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto py-4"
                  onClick={() => navigate('/educare-app/professional/children')}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Baby className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Gestão das Crianças</p>
                    <p className="text-sm text-muted-foreground">Convites, acompanhamento e comunicação</p>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto py-4"
                  onClick={() => navigate('/educare-app/professional/qualificacao')}
                >
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Qualificação Profissional</p>
                    <p className="text-sm text-muted-foreground">Cursos, treinamentos e materiais</p>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto py-4"
                  onClick={() => navigate('/educare-app/professional/welcome')}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Central de Conteúdos</p>
                    <p className="text-sm text-muted-foreground">Notícias e atualizações para profissionais</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {pendingInvitations.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Convites Pendentes
              </CardTitle>
              <CardDescription>
                Você tem {pendingInvitations.length} convite(s) aguardando resposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/educare-app/professional/children')}
                className="bg-amber-600 hover:bg-amber-700 gap-2"
              >
                Gerenciar Convites
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ProfessionalDashboard;
