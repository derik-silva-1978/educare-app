
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { AlertTriangle, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Loader, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StudentAnalyticsTabProps {
  studentId: string;
  studentName: string;
}

// Function to get assessment data from localStorage
const getStudentAssessments = (studentId: string) => {
  const assessments = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('pei_') && key?.includes('_submitted')) {
      try {
        const assessmentData = JSON.parse(localStorage.getItem(key) || '');
        if (assessmentData.studentId === studentId) {
          assessments.push(assessmentData);
        }
      } catch (e) {
        console.error('Error parsing assessment data:', e);
      }
    }
  }
  
  return assessments.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Functions to process assessment data for charts
const processScoresByDomain = (assessments: any[]) => {
  if (!assessments.length) return [];
  
  // Get the most recent assessment
  const latestAssessment = assessments[0];
  
  const domainScores = latestAssessment.domains.map((domain: string) => {
    const domainItems = latestAssessment.items.filter((item: any) => item.domain === domain);
    
    const totalItems = domainItems.length;
    const levelScores = {
      not_present: 0,
      emerging: 1,
      developing: 2,
      acquired: 3
    };
    
    let totalScore = 0;
    domainItems.forEach((item: any) => {
      if (item.level) {
        totalScore += levelScores[item.level as keyof typeof levelScores];
      }
    });
    
    // Calculate percentage (0-100)
    const maxPossibleScore = totalItems * 3; // 3 is the max score for "acquired"
    const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    // Get domain label
    let domainLabel = domain;
    switch (domain) {
      case 'communication': domainLabel = 'Comunicação'; break;
      case 'motor': domainLabel = 'Motor'; break;
      case 'cognitive': domainLabel = 'Cognitivo'; break;
      case 'social': domainLabel = 'Social'; break;
      case 'adaptive': domainLabel = 'Adaptativo'; break;
      case 'sensory': domainLabel = 'Sensorial'; break;
    }
    
    return {
      domain,
      domainLabel,
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage: scorePercentage
    };
  });
  
  return domainScores;
};

const processProgressOverTime = (assessments: any[]) => {
  if (assessments.length < 2) return [];
  
  // Create a map of domain scores for each assessment
  const progressData = assessments.map(assessment => {
    const domains = assessment.domains || [];
    const result = {
      date: new Date(assessment.date).toLocaleDateString('pt-BR'),
      timestamp: new Date(assessment.date).getTime()
    } as any;
    
    domains.forEach(domain => {
      const domainItems = assessment.items.filter((item: any) => item.domain === domain);
      
      const totalItems = domainItems.length;
      const levelScores = {
        not_present: 0,
        emerging: 1,
        developing: 2,
        acquired: 3
      };
      
      let totalScore = 0;
      domainItems.forEach((item: any) => {
        if (item.level) {
          totalScore += levelScores[item.level as keyof typeof levelScores];
        }
      });
      
      // Calculate percentage (0-100)
      const maxPossibleScore = totalItems * 3; // 3 is the max score for "acquired"
      const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);
      
      result[domain] = scorePercentage;
    });
    
    return result;
  }).sort((a, b) => a.timestamp - b.timestamp);
  
  return progressData;
};

export const StudentAnalyticsTab: React.FC<StudentAnalyticsTabProps> = ({ studentId, studentName }) => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('domains');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load student assessments
    const studentAssessments = getStudentAssessments(studentId);
    setAssessments(studentAssessments);
    setLoading(false);
  }, [studentId]);
  
  const domainScores = processScoresByDomain(assessments);
  const progressData = processProgressOverTime(assessments);
  
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dados de análise...</p>
      </div>
    );
  }
  
  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma avaliação disponível</h3>
          <p className="text-muted-foreground text-center mb-6">
            É necessário realizar pelo menos uma avaliação para gerar análises.
          </p>
          <Button onClick={() => navigate('/smart-pei/assessments', { state: { studentId } })}>
            Criar Nova Avaliação
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (assessments.length === 1 && activeChart === 'progress') {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          São necessárias pelo menos duas avaliações para mostrar o progresso ao longo do tempo.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Análise de Desempenho: {studentName}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/smart-pei/assessments', { state: { studentId } })}
        >
          Nova Avaliação
        </Button>
      </div>
      
      <Tabs value={activeChart} onValueChange={setActiveChart}>
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="domains">
            <BarChart2 className="h-4 w-4 mr-2" />
            Por Domínio
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={assessments.length < 2}>
            <LineChartIcon className="h-4 w-4 mr-2" />
            Progresso
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Distribuição
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Domínio</CardTitle>
              <CardDescription>
                Pontuação atual em cada área de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={domainScores}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domainLabel" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Pontuação']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="percentage" 
                        name="Pontuação (%)" 
                        fill="#4f46e5" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Detalhamento por Domínio</h3>
                {domainScores.map((item, index) => (
                  <div key={item.domain} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.domainLabel}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.score} de {item.maxScore} pontos
                      </span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2"
                      style={{ 
                        backgroundColor: '#e5e7eb',
                        '--tw-progress-color': COLORS[index % COLORS.length]
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progresso ao Longo do Tempo</CardTitle>
              <CardDescription>
                Evolução da pontuação em cada domínio entre avaliações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    {assessments[0].domains.map((domain: string, index: number) => {
                      let domainLabel = domain;
                      switch (domain) {
                        case 'communication': domainLabel = 'Comunicação'; break;
                        case 'motor': domainLabel = 'Motor'; break;
                        case 'cognitive': domainLabel = 'Cognitivo'; break;
                        case 'social': domainLabel = 'Social'; break;
                        case 'adaptive': domainLabel = 'Adaptativo'; break;
                        case 'sensory': domainLabel = 'Sensorial'; break;
                      }
                      
                      return (
                        <Line
                          key={domain}
                          type="monotone"
                          dataKey={domain}
                          name={domainLabel}
                          stroke={COLORS[index % COLORS.length]}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Níveis</CardTitle>
              <CardDescription>
                Porcentagem de itens em cada nível de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(() => {
                        if (assessments.length === 0) return [];
                        
                        const latestAssessment = assessments[0];
                        const levelCounts = {
                          not_present: 0,
                          emerging: 0,
                          developing: 0,
                          acquired: 0
                        };
                        
                        latestAssessment.items.forEach((item: any) => {
                          if (item.level) {
                            levelCounts[item.level as keyof typeof levelCounts]++;
                          }
                        });
                        
                        return [
                          { name: 'Não Presente', value: levelCounts.not_present, color: '#ef4444' },
                          { name: 'Emergente', value: levelCounts.emerging, color: '#f59e0b' },
                          { name: 'Em Desenvolvimento', value: levelCounts.developing, color: '#3b82f6' },
                          { name: 'Adquirido', value: levelCounts.acquired, color: '#10b981' }
                        ];
                      })()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(() => {
                        if (assessments.length === 0) return null;
                        
                        const latestAssessment = assessments[0];
                        const levelCounts = {
                          not_present: 0,
                          emerging: 0,
                          developing: 0,
                          acquired: 0
                        };
                        
                        latestAssessment.items.forEach((item: any) => {
                          if (item.level) {
                            levelCounts[item.level as keyof typeof levelCounts]++;
                          }
                        });
                        
                        const data = [
                          { name: 'Não Presente', value: levelCounts.not_present, color: '#ef4444' },
                          { name: 'Emergente', value: levelCounts.emerging, color: '#f59e0b' },
                          { name: 'Em Desenvolvimento', value: levelCounts.developing, color: '#3b82f6' },
                          { name: 'Adquirido', value: levelCounts.acquired, color: '#10b981' }
                        ];
                        
                        return data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ));
                      })()}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} itens`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Análise de Pontos Fortes e Necessidades</CardTitle>
        </CardHeader>
        <CardContent>
          {assessments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Pontos Fortes</h3>
                <div className="space-y-2">
                  {(() => {
                    if (assessments.length === 0) return null;
                    
                    const latestAssessment = assessments[0];
                    // Find domains with highest percentage of acquired items
                    const domainStrengths = latestAssessment.domains.map((domain: string) => {
                      const domainItems = latestAssessment.items.filter((item: any) => item.domain === domain);
                      const acquiredItems = domainItems.filter((item: any) => item.level === 'acquired').length;
                      const percentage = (acquiredItems / domainItems.length) * 100;
                      
                      let domainLabel = domain;
                      switch (domain) {
                        case 'communication': domainLabel = 'Comunicação'; break;
                        case 'motor': domainLabel = 'Motor'; break;
                        case 'cognitive': domainLabel = 'Cognitivo'; break;
                        case 'social': domainLabel = 'Social'; break;
                        case 'adaptive': domainLabel = 'Adaptativo'; break;
                        case 'sensory': domainLabel = 'Sensorial'; break;
                      }
                      
                      return { domain, domainLabel, percentage };
                    }).sort((a, b) => b.percentage - a.percentage);
                    
                    // Return top 3 strengths
                    return domainStrengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="bg-muted p-3 rounded-md">
                        <div className="font-medium">{strength.domainLabel}</div>
                        <div className="text-sm text-muted-foreground">
                          {strength.percentage.toFixed(0)}% de itens adquiridos
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Necessidades</h3>
                <div className="space-y-2">
                  {(() => {
                    if (assessments.length === 0) return null;
                    
                    const latestAssessment = assessments[0];
                    // Find domains with highest percentage of not present items
                    const domainNeeds = latestAssessment.domains.map((domain: string) => {
                      const domainItems = latestAssessment.items.filter((item: any) => item.domain === domain);
                      const notPresentItems = domainItems.filter((item: any) => 
                        item.level === 'not_present' || item.level === 'emerging'
                      ).length;
                      const percentage = (notPresentItems / domainItems.length) * 100;
                      
                      let domainLabel = domain;
                      switch (domain) {
                        case 'communication': domainLabel = 'Comunicação'; break;
                        case 'motor': domainLabel = 'Motor'; break;
                        case 'cognitive': domainLabel = 'Cognitivo'; break;
                        case 'social': domainLabel = 'Social'; break;
                        case 'adaptive': domainLabel = 'Adaptativo'; break;
                        case 'sensory': domainLabel = 'Sensorial'; break;
                      }
                      
                      return { domain, domainLabel, percentage };
                    }).sort((a, b) => b.percentage - a.percentage);
                    
                    // Return top 3 needs
                    return domainNeeds.slice(0, 3).map((need, index) => (
                      <div key={index} className="bg-muted p-3 rounded-md">
                        <div className="font-medium">{need.domainLabel}</div>
                        <div className="text-sm text-muted-foreground">
                          {need.percentage.toFixed(0)}% de itens não presentes ou emergentes
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
