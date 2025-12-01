
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, FileText, Accessibility, Users } from 'lucide-react';
import DashboardErrorBoundary from './DashboardErrorBoundary';

const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardErrorBoundary>
      <div className="space-y-6">
        <DashboardErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-100 dark:border-purple-900 shadow-sm overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 -mt-8 -mr-8 bg-purple-200 dark:bg-purple-800 rounded-full opacity-30"></div>
              <CardHeader>
                <CardTitle className="text-xl text-purple-800 dark:text-purple-200">Perfil Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative z-10">
                  <p className="text-purple-700 dark:text-purple-300">
                    Complete seu perfil profissional para começar a receber convites para acompanhar crianças.
                  </p>
                  <Button onClick={() => navigate('/educare-app/settings')} variant="default" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800">
                    <Users className="h-4 w-4 mr-2" />
                    Completar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Convites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="h-12 w-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Você ainda não recebeu convites para acompanhar crianças.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complete seu perfil para aumentar suas chances de receber convites.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardErrorBoundary>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-100">Recursos Disponíveis</h2>
        <DashboardErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                  Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Acesse e gerencie avaliações de desenvolvimento para seus pacientes.
                </p>
                <Button variant="outline" size="sm" className="w-full group" onClick={() => navigate('/educare-app/assessments')}>
                  Ver Avaliações
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Gere relatórios detalhados sobre o desenvolvimento das crianças.
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Em Breve
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Accessibility className="h-5 w-5 mr-2 text-primary" />
                  Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Biblioteca de técnicas e atividades terapêuticas para recomendação.
                </p>
                <Button variant="outline" size="sm" className="w-full group" onClick={() => navigate('/educare-app/activities')}>
                  Ver Atividades
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardErrorBoundary>
      </div>
    </DashboardErrorBoundary>
  );
};

export default ProfessionalDashboard;
