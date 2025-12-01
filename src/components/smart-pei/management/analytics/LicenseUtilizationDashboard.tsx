
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { License } from '@/types/license';
import { BarChart2, PieChart as PieChartIcon, Calendar, Layers } from 'lucide-react';

const COLORS = ['#4C51BF', '#48BB78', '#ED8936', '#A3BFFA', '#667EEA'];
const LICENSE_TYPES = {
  trial: 'Teste',
  standard: 'Padrão',
  professional: 'Profissional',
  enterprise: 'Empresarial',
  individual: 'Individual'
};

export const LicenseUtilizationDashboard: React.FC = () => {
  const { licenses, licenseMetrics } = useLicenseManagement();
  const [activeTab, setActiveTab] = useState('distribution');
  
  // Calculate percentage of active licenses
  const activePercentage = licenses.length > 0
    ? Math.round((licenseMetrics.active / licenseMetrics.total) * 100)
    : 0;
  
  // Calculate usage for enterprise licenses
  const enterpriseLicenses = licenses.filter(license => license.model === 'enterprise');
  
  // Prepare data for license by type chart
  const licenseByTypeData = Object.entries(licenseMetrics.byType).map(([type, count]) => ({
    name: LICENSE_TYPES[type as keyof typeof LICENSE_TYPES] || type,
    value: count
  }));
  
  // Prepare data for expiration by month chart
  const expirationData = licenseMetrics.expirationByMonth.map(item => ({
    name: item.month,
    count: item.count
  }));
  
  // Enterprise usage chart data
  const enterpriseUsageData = enterpriseLicenses.map(license => ({
    name: license.assignedTo || 'Não atribuída',
    usado: license.usedCount || 0,
    total: license.totalCount || license.maxUsers,
    percentagem: license.totalCount ? Math.round(((license.usedCount || 0) / license.totalCount) * 100) : 0
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Licenças Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseMetrics.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Individuais: {licenses.filter(l => l.model === 'individual').length} | 
              Empresariais: {licenses.filter(l => l.model === 'enterprise').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Licenças Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{licenseMetrics.active}</div>
              <div className="text-sm text-muted-foreground">{activePercentage}%</div>
            </div>
            <Progress value={activePercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiram em 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseMetrics.expiringIn30Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {licenseMetrics.expiringIn30Days > 0 ? 'Ação recomendada: entrar em contato para renovação' : 'Nenhuma licença expirando em breve'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atribuição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenseMetrics.assigned} / {licenseMetrics.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Não atribuídas: {licenseMetrics.unassigned} licenças
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="distribution" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="expiration" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Expiração
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Utilização
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Equipes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
              <CardDescription>Distribuição de licenças por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={licenseByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {licenseByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expiration">
          <Card>
            <CardHeader>
              <CardTitle>Expiração por Mês</CardTitle>
              <CardDescription>Previsão de licenças que expiram nos próximos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expirationData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Licenças" fill="#4C51BF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Utilização de Licenças Empresariais</CardTitle>
              <CardDescription>Uso de slots em licenças empresariais</CardDescription>
            </CardHeader>
            <CardContent>
              {enterpriseLicenses.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={enterpriseUsageData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value, name) => [value, name === "usado" ? "Licenças Usadas" : "Total de Licenças"]} />
                      <Legend />
                      <Bar dataKey="usado" fill="#4C51BF" name="Licenças Usadas" />
                      <Bar dataKey="total" fill="#E2E8F0" name="Total de Licenças" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">Nenhuma licença empresarial encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Equipes por Licença</CardTitle>
              <CardDescription>Total de equipes alocadas por licença</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses
                  .filter(license => license.teams && license.teams.length > 0)
                  .map(license => (
                    <div key={license.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium">{license.assignedTo}</span>
                          <span className="text-sm text-muted-foreground ml-2 capitalize">({license.model} - {license.type})</span>
                        </div>
                        <div className="text-sm">
                          {license.teams?.length} equipe(s)
                        </div>
                      </div>
                      <Progress 
                        value={license.model === 'enterprise' ? 
                          ((license.teams?.length || 0) / (license.totalCount || license.maxUsers)) * 100 : 
                          ((license.teams?.length || 0) > 0 ? 100 : 0)} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                  
                {!licenses.some(license => license.teams && license.teams.length > 0) && (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">Nenhuma equipe alocada às licenças</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LicenseUtilizationDashboard;
