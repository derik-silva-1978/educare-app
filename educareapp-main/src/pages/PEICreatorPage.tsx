
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft } from 'lucide-react';
import { TitibotProvider, useTitibot } from '@/components/smart-pei/titibot/TitibotProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Import PEICreator as a default import
import PEICreator from '@/components/smart-pei/pei/PEICreator';

const PEICreatorPageContent: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { openTitibot } = useTitibot();
  
  const handleOpenAssistant = () => {
    openTitibot();
  };
  
  const handleBack = () => {
    if (studentId) {
      navigate(`/smart-pei/students/${studentId}`);
    } else {
      navigate('/smart-pei/students');
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <h1 className="text-2xl font-bold">Criação de PEI</h1>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleOpenAssistant}
          className="flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          <span>Assistente PEI</span>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800">Assistente Inteligente PEI</CardTitle>
            <CardDescription className="text-blue-700">
              Seu PEI agora conta com sugestões inteligentes em cada etapa do processo. 
              Experimente os botões de sugestão AI para obter recomendações personalizadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border border-blue-100">
                <strong className="text-blue-800">1. Informações Gerais</strong>
                <p className="text-blue-600 mt-1">AI sugere títulos e resumos baseados no perfil do estudante</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-100">
                <strong className="text-blue-800">2. Objetivos e Estratégias</strong>
                <p className="text-blue-600 mt-1">AI sugere objetivos SMART e estratégias baseadas nas avaliações</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-100">
                <strong className="text-blue-800">3. Validação BNCC</strong>
                <p className="text-blue-600 mt-1">Verificação automática de alinhamento com diretrizes educacionais</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {studentId ? (
          <PEICreator 
            studentId={studentId} 
            onCreated={(peiId) => navigate(`/smart-pei/students/${studentId}/pei/${peiId}`)} 
          />
        ) : (
          <div className="text-center py-12 bg-muted/10 rounded-lg border">
            <h2 className="text-xl font-medium mb-2">Nenhum estudante selecionado</h2>
            <p className="text-muted-foreground mb-4">
              Selecione um estudante para criar um novo PEI.
            </p>
            <Button onClick={() => navigate('/smart-pei/students')}>
              Ir para Lista de Estudantes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const PEICreatorPage: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Criar PEI | Smart PEI</title>
        <meta name="description" content="Crie um novo Plano de Ensino Individualizado no Smart PEI" />
      </Helmet>
      
      <TitibotProvider>
        <PEICreatorPageContent />
      </TitibotProvider>
    </React.Fragment>
  );
};

export default PEICreatorPage;
