
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportFormatsViewer = () => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/smart-pei/app/reports');
  };
  
  const handleCreateReport = (type: string) => {
    navigate('/smart-pei/app/reports/new');
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Relatórios
        </Button>
        
        <h1 className="text-2xl font-bold">Formatos de Relatórios</h1>
        <p className="text-muted-foreground">
          Conheça os diferentes formatos de relatórios disponíveis no Smart PEI.
        </p>
      </div>
      
      <Tabs defaultValue="pedagogical">
        <TabsList className="mb-4">
          <TabsTrigger value="pedagogical">Relatórios Pedagógicos</TabsTrigger>
          <TabsTrigger value="technical">Relatórios Técnicos</TabsTrigger>
          <TabsTrigger value="administrative">Relatórios Administrativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pedagogical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório de Progresso Mensal
              </CardTitle>
              <CardDescription>
                Acompanhamento mensal do desenvolvimento do aluno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                O Relatório de Progresso Mensal documenta o desenvolvimento contínuo do aluno em seus objetivos de aprendizagem, destacando conquistas, desafios e ajustes necessários no curto prazo.
              </p>
              <Button onClick={() => handleCreateReport('monthly-progress')}>
                Criar este relatório
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório de Progresso Trimestral
              </CardTitle>
              <CardDescription>
                Documenta o progresso geral do aluno durante um trimestre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Resumo trimestral do progresso do aluno, ideal para compartilhar com pais e responsáveis em reuniões periódicas. Inclui análise do desenvolvimento em cada domínio e recomendações.
              </p>
              <Button onClick={() => handleCreateReport('quarterly-report')}>
                Criar este relatório
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório de Avaliação Completa
              </CardTitle>
              <CardDescription>
                Avaliação detalhada do aluno com base em dados de avaliações e PEI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Relatório técnico que integra dados de diferentes avaliações e do PEI para fornecer uma visão abrangente do desenvolvimento do aluno em todos os domínios.
              </p>
              <Button onClick={() => handleCreateReport('assessment')}>
                Criar este relatório
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="administrative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório Institucional
              </CardTitle>
              <CardDescription>
                Dados agregados para fins administrativos e institucionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Relatório destinado a apresentar dados agregados sobre o progresso dos alunos, eficácia das intervenções e resultados para equipe gestora e secretarias de educação.
              </p>
              <Button onClick={() => handleCreateReport('institutional')}>
                Criar este relatório
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportFormatsViewer;
