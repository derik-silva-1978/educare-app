
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp
} from 'lucide-react';

const DashboardMetrics: React.FC = () => {
  return (
    <div className="bg-muted/10 p-4 rounded-lg border">
      <h3 className="text-lg font-medium text-center mb-4">Métricas do Dashboard</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">247</div>
                <div className="text-muted-foreground text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+12%</span> Alunos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-4">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">186</div>
                <div className="text-muted-foreground text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+8%</span> PEIs Ativos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">74</div>
                <div className="text-muted-foreground text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+15%</span> Relatórios
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-4">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">42</div>
                <div className="text-muted-foreground text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+5%</span> Especialistas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;
