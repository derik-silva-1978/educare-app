
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Clock, Calendar, TrendingUp, Award } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardSummaryProps {
  userRole: 'parent' | 'professional';
}

const COLORS = ['#4f46e5', '#14b8a6', '#f59e0b', '#ef4444'];

const PieChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, name]} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ userRole }) => {
  // This would come from an API in a real application
  const summaryData = {
    completedActivities: 12,
    pendingActivities: 5,
    totalAssessments: 4,
    completedAssessments: 3,
    journeyProgress: 65,
    lastActivity: '2023-12-18'
  };
  
  const developmentData = [
    { name: 'Comunicação', value: 35 },
    { name: 'Motor', value: 25 },
    { name: 'Social', value: 20 },
    { name: 'Cognitivo', value: 20 }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Atividades Completadas</p>
              <p className="text-2xl font-bold">{summaryData.completedActivities}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Atividades Pendentes</p>
              <p className="text-2xl font-bold">{summaryData.pendingActivities}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avaliações Realizadas</p>
              <p className="text-2xl font-bold">{summaryData.completedAssessments}/{summaryData.totalAssessments}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Progresso da Jornada</p>
              <p className="text-2xl font-bold">{summaryData.journeyProgress}%</p>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Última atividade em: {summaryData.lastActivity}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Áreas de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={developmentData} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {developmentData.map((item, index) => (
              <div key={item.name} className="flex items-center text-sm">
                <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
