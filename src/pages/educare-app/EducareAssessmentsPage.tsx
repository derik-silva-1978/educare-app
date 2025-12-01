
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, PlusCircle, Search, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

// Mock data for assessments
const mockAssessments = [
  {
    id: '1',
    title: 'Avaliação de Desenvolvimento',
    childName: 'Maria Silva',
    date: new Date('2025-02-10'),
    status: 'completed',
    progress: 100,
    domains: ['motor', 'cognitive', 'social_emotional', 'communication']
  },
  {
    id: '2',
    title: 'Avaliação Trimestral',
    childName: 'João Santos',
    date: new Date('2025-03-05'),
    status: 'in_progress',
    progress: 65,
    domains: ['motor', 'cognitive', 'social_emotional']
  },
  {
    id: '3',
    title: 'Avaliação Inicial',
    childName: 'Pedro Costa',
    date: new Date('2025-03-20'),
    status: 'not_started',
    progress: 0,
    domains: ['motor', 'cognitive', 'communication']
  }
];

const EducareAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [assessments, setAssessments] = useState(mockAssessments);
  
  const filterAssessments = () => {
    let filtered = mockAssessments;
    
    if (searchTerm) {
      filtered = filtered.filter(assessment => 
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.childName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(assessment => assessment.status === activeTab);
    }
    
    return filtered;
  };
  
  const handleNewAssessment = () => {
    toast({
      title: "Nova avaliação",
      description: "Selecione uma criança para iniciar a avaliação",
    });
    navigate('/educare-app/children');
  };
  
  const handleOpenAssessment = (id: string) => {
    navigate(`/educare-app/assessment/${id}`);
  };
  
  const filteredAssessments = filterAssessments();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Avaliações | Educare App</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="mr-2 h-6 w-6 text-blue-600" />
            Avaliações de Desenvolvimento
          </h1>
          <p className="text-gray-500 mt-1">
            Monitore o desenvolvimento infantil através de avaliações periódicas
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button onClick={handleNewAssessment} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input 
            placeholder="Buscar avaliações..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
            <TabsTrigger value="not_started">Não Iniciadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredAssessments.length === 0 ? (
        <Card className="bg-gray-50 border-dashed border-2">
          <CardContent className="p-8 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Nenhuma avaliação corresponde aos critérios de busca."
                : "Você ainda não tem avaliações. Inicie uma nova avaliação para começar."}
            </p>
            <Button onClick={handleNewAssessment} variant="outline">
              Criar Nova Avaliação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenAssessment(assessment.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{assessment.title}</CardTitle>
                    <div 
                      className={`px-2 py-1 text-xs rounded-full ${
                        assessment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : assessment.status === 'in_progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {assessment.status === 'completed' 
                        ? 'Concluída' 
                        : assessment.status === 'in_progress' 
                          ? 'Em Andamento' 
                          : 'Não Iniciada'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Criança: {assessment.childName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progresso</span>
                        <span>{assessment.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${assessment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {assessment.domains.map(domain => (
                        <span 
                          key={domain} 
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {domain === 'motor' 
                            ? 'Motor' 
                            : domain === 'cognitive' 
                              ? 'Cognitivo' 
                              : domain === 'social_emotional' 
                                ? 'Sócio-emocional' 
                                : 'Comunicação'}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Data: {assessment.date.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducareAssessmentsPage;
