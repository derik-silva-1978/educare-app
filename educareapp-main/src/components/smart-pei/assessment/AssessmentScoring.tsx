
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChartIcon, BarChart2Icon, TrendingUp } from 'lucide-react';

interface AssessmentScoringProps {
  items: any[];
  domains: string[];
}

export const AssessmentScoring: React.FC<AssessmentScoringProps> = ({ items, domains }) => {
  // Calculate scores for each level
  const levelCounts = {
    not_present: 0,
    emerging: 0,
    developing: 0,
    developing_strong: 0,
    acquired: 0,
    not_assessed: 0
  };
  
  items.forEach(item => {
    if (!item.level) {
      levelCounts.not_assessed++;
    } else {
      levelCounts[item.level as keyof typeof levelCounts]++;
    }
  });
  
  // Calculate domain scores
  const domainScores = domains.map(domain => {
    const domainItems = items.filter(item => item.domain === domain);
    const assessedItems = domainItems.filter(item => item.level);
    const totalItems = domainItems.length;
    
    let domainLabel = domain;
    switch (domain) {
      case 'communication': domainLabel = 'Comunicação'; break;
      case 'motor': domainLabel = 'Motor'; break;
      case 'cognitive': domainLabel = 'Cognitivo'; break;
      case 'social': domainLabel = 'Social'; break;
      case 'adaptive': domainLabel = 'Adaptativo'; break;
      case 'sensory': domainLabel = 'Sensorial'; break;
    }
    
    // Calculate domain strength
    const strengthScore = calculateDomainStrength(domainItems);
    
    return {
      domain,
      domainLabel,
      totalItems,
      assessedItems: assessedItems.length,
      completionPercentage: Math.round((assessedItems.length / totalItems) * 100),
      strengthScore
    };
  });
  
  // Calculate domain strength (weighted average of levels)
  const calculateDomainStrength = (domainItems: any[]) => {
    const assessedItems = domainItems.filter(item => item.level);
    if (assessedItems.length === 0) return 0;
    
    const levelWeights = {
      not_present: 0,
      emerging: 1,
      developing: 2,
      developing_strong: 3,
      acquired: 4
    };
    
    const totalWeight = assessedItems.reduce((sum, item) => {
      return sum + (levelWeights[item.level as keyof typeof levelWeights] || 0);
    }, 0);
    
    return Math.round((totalWeight / (assessedItems.length * 4)) * 100);
  };
  
  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Não Presente', value: levelCounts.not_present, color: '#ef4444' },
    { name: 'Emergente', value: levelCounts.emerging, color: '#f59e0b' },
    { name: 'Em Desenvolvimento', value: levelCounts.developing + levelCounts.developing_strong, color: '#3b82f6' },
    { name: 'Adquirido', value: levelCounts.acquired, color: '#10b981' }
  ];
  
  // Only include levels with values > 0
  const filteredPieChartData = pieChartData.filter(item => item.value > 0);
  
  // Sort domain scores by strength for bar chart
  const sortedDomainScores = [...domainScores].sort((a, b) => b.strengthScore - a.strengthScore);
  
  const assessedItemsCount = items.length - levelCounts.not_assessed;
  const assessmentCompletionPercentage = Math.round((assessedItemsCount / items.length) * 100);
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Pontuação da Avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Distribuição
            </TabsTrigger>
            <TabsTrigger value="domains">
              <BarChart2Icon className="h-4 w-4 mr-2" />
              Domínios
            </TabsTrigger>
            <TabsTrigger value="insights">
              <TrendingUp className="h-4 w-4 mr-2" />
              Análise
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Distribuição dos Níveis</h3>
                
                <div className="h-64">
                  {filteredPieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredPieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {filteredPieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} itens`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Nenhum item avaliado</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Progresso por Domínio</h3>
                
                <div className="space-y-4">
                  {domainScores.map(score => (
                    <div key={score.domain} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{score.domainLabel}</span>
                        <span className="text-sm text-muted-foreground">
                          {score.assessedItems} de {score.totalItems} itens
                        </span>
                      </div>
                      <Progress value={score.completionPercentage} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Progresso Total</span>
                    <span className="text-sm text-muted-foreground">
                      {assessedItemsCount} de {items.length} itens
                    </span>
                  </div>
                  <Progress 
                    value={assessmentCompletionPercentage} 
                    className="h-3" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="domains">
            <div>
              <h3 className="text-lg font-medium mb-4">Força por Domínio</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedDomainScores}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="domainLabel" />
                    <YAxis label={{ value: 'Nível de Força (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Força']} />
                    <Bar dataKey="strengthScore" fill="#4f46e5" name="Força" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedDomainScores.map(domain => (
                  <Card key={domain.domain} className={`border-l-4 ${domain.strengthScore > 75 ? 'border-l-green-500' : domain.strengthScore > 50 ? 'border-l-blue-500' : domain.strengthScore > 25 ? 'border-l-orange-500' : 'border-l-red-500'}`}>
                    <CardContent className="pt-6">
                      <h4 className="font-medium">{domain.domainLabel}</h4>
                      <div className="flex items-center mt-2">
                        <Progress value={domain.strengthScore} className="h-2 flex-1" />
                        <span className="ml-2 text-sm font-medium">{domain.strengthScore}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Resumo da Avaliação</h3>
                <p className="text-muted-foreground">
                  A avaliação está {assessmentCompletionPercentage}% completa, com {assessedItemsCount} de {items.length} itens avaliados.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Áreas de Força</h3>
                {sortedDomainScores.length > 0 && (
                  <div className="space-y-1">
                    {sortedDomainScores.slice(0, 2).map(domain => (
                      <p key={domain.domain}>
                        • <span className="font-medium">{domain.domainLabel}</span>: {domain.strengthScore}% de força
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Áreas para Desenvolvimento</h3>
                {sortedDomainScores.length > 0 && (
                  <div className="space-y-1">
                    {sortedDomainScores.slice(-2).reverse().map(domain => (
                      <p key={domain.domain}>
                        • <span className="font-medium">{domain.domainLabel}</span>: {domain.strengthScore}% de força
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recomendações</h3>
                <p>• Concentre-se no desenvolvimento de habilidades em {sortedDomainScores[sortedDomainScores.length - 1]?.domainLabel || 'áreas de menor força'}</p>
                <p>• Use os pontos fortes em {sortedDomainScores[0]?.domainLabel || 'áreas de maior força'} para apoiar o desenvolvimento de outras áreas</p>
                <p>• Complete a avaliação dos itens restantes para uma análise mais precisa</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssessmentScoring;
