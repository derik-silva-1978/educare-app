
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Calendar, Plus, ArrowRight, Baby } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMaternalHealthProfile } from '@/hooks/maternal-health/useMaternalHealthProfile';
import { useMaternalDailyHealth } from '@/hooks/maternal-health/useMaternalDailyHealth';

export const MaternalHealthDashboardCard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useMaternalHealthProfile();
  const { healthRecords, isLoading: recordsLoading } = useMaternalDailyHealth(profile?.id);

  const recentRecord = healthRecords?.[0];
  const recordsThisWeek = healthRecords?.filter(record => {
    const recordDate = new Date(record.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return recordDate >= oneWeekAgo;
  }).length || 0;

  if (profileLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="py-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-100 border-2 border-rose-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg text-rose-800">Saúde Materna</CardTitle>
          </div>
          {profile && (
            <Badge 
              variant={profile.high_risk ? "destructive" : "secondary"}
              className={profile.high_risk ? "bg-red-100 text-red-800 border-red-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"}
            >
              {profile.high_risk ? "Alto Risco" : "Acompanhamento"}
            </Badge>
          )}
        </div>
        <CardDescription className="text-rose-700">
          {profile ? "Acompanhe sua gestação" : "Configure seu perfil maternal"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile ? (
          <>
            {/* Pregnancy Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/70 p-3 rounded-lg">
                <span className="text-rose-600 text-xs">Semana:</span>
                <p className="font-bold text-lg text-blue-600 flex items-center gap-1">
                  <Baby className="h-4 w-4" />
                  {profile.pregnancy_week || 'N/A'}
                </p>
              </div>
              <div className="bg-white/70 p-3 rounded-lg">
                <span className="text-rose-600 text-xs">Data Prevista:</span>
                <p className="font-medium text-slate-800">
                  {profile.due_date ? new Date(profile.due_date).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-2 bg-white/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">Esta semana:</span>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  {recordsThisWeek} registros
                </Badge>
              </div>
              
              {recentRecord && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-600">Último registro:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(recentRecord.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/educare-app/maternal-health?tab=health');
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Novo Registro
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/80 border-rose-300 text-rose-700 hover:bg-rose-50" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/educare-app/maternal-health?tab=growth');
                }}
              >
                Ver Progresso
              </Button>
            </div>

            {/* View Full Profile Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-rose-700 hover:bg-rose-100" 
              onClick={() => navigate('/educare-app/maternal-health')}
            >
              Ver Perfil Completo
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <Baby className="h-8 w-8 text-rose-400 mx-auto mb-3" />
            <p className="text-rose-600 text-sm mb-3">
              Configure seu perfil para começar o acompanhamento
            </p>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/educare-app/maternal-health');
              }}
            >
              <Heart className="h-3 w-3 mr-1" />
              Criar Perfil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
