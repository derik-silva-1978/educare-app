
import React from 'react';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartExportMenu } from '../../dashboard/ChartExportMenu';

export const LicenseAnalytics: React.FC = () => {
  const { licenses, licenseMetrics } = useLicenseManagement();
  const chartRefBar = React.useRef<HTMLDivElement>(null);
  const chartRefPie = React.useRef<HTMLDivElement>(null);
  
  const licenseTypeData = [
    { name: 'Trial', value: licenseMetrics.byType.trial || 0 },
    { name: 'Standard', value: licenseMetrics.byType.standard || 0 },
    { name: 'Professional', value: licenseMetrics.byType.professional || 0 },
    { name: 'Enterprise', value: licenseMetrics.byType.enterprise || 0 }
  ];
  
  const licenseStatusData = [
    { name: 'Ativas', value: licenseMetrics.active },
    { name: 'Inativas', value: licenseMetrics.inactive },
    { name: 'Expiradas', value: licenseMetrics.expired }
  ];
  
  const monthlyExpirationData = licenseMetrics.expirationByMonth;
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total de Licenças</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Licenças gerenciadas pelo sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Licenças Ativas</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseMetrics.active}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((licenseMetrics.active / licenses.length) * 100) || 0}% do total de licenças
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Licenças Atribuídas</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseMetrics.assigned}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((licenseMetrics.assigned / licenses.length) * 100) || 0}% do total de licenças
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Expiram em 30 dias</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseMetrics.expiringIn30Days}</div>
            <p className="text-xs text-muted-foreground">
              Licenças que precisam ser renovadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Tipos de Licença</CardTitle>
              <CardDescription>Distribuição por tipo de licença</CardDescription>
            </div>
            <ChartExportMenu data={licenseTypeData} chartRef={chartRefPie} title="Tipos de Licença" />
          </CardHeader>
          <CardContent className="h-80" ref={chartRefPie}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={licenseTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {licenseTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Status de Licenças</CardTitle>
              <CardDescription>Licenças ativas, inativas e expiradas</CardDescription>
            </div>
            <ChartExportMenu data={licenseStatusData} chartRef={chartRefPie} title="Status de Licenças" />
          </CardHeader>
          <CardContent className="h-80" ref={chartRefPie}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={licenseStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {licenseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Licenças a Expirar (próximos meses)</CardTitle>
            <CardDescription>Número de licenças que expiram por mês</CardDescription>
          </div>
          <ChartExportMenu data={monthlyExpirationData} chartRef={chartRefBar} title="Expiração de Licenças" />
        </CardHeader>
        <CardContent className="h-80" ref={chartRefBar}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyExpirationData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Licenças a Expirar" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseAnalytics;
