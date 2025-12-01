
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { DevelopmentDomain, DomainLabels } from '@/types/assessment';
import useAssessmentService from '@/hooks/useAssessmentService';

const NewAssessmentPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, createAssessment } = useAssessmentService();
  
  const [title, setTitle] = useState('Avaliação de Desenvolvimento');
  const [ageMonths, setAgeMonths] = useState<number>(24);
  const [selectedDomains, setSelectedDomains] = useState<DevelopmentDomain[]>([
    'communication', 
    'motor', 
    'social_emotional',
    'cognitive',
    'self_care'
  ]);
  const [activeTab, setActiveTab] = useState('info');
  
  const domains: { id: DevelopmentDomain, label: string }[] = [
    { id: 'communication', label: 'Comunicação' },
    { id: 'motor', label: 'Habilidades Motoras' },
    { id: 'social_emotional', label: 'Social e Emocional' },
    { id: 'cognitive', label: 'Cognitivo' },
    { id: 'self_care', label: 'Autocuidado' },
    { id: 'maternal_health', label: 'Saúde Materna' }
  ];

  const handleDomainToggle = (domain: DevelopmentDomain) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };
  
  const handleAgeChange = (value: string) => {
    const age = parseInt(value);
    if (!isNaN(age) && age >= 0 && age <= 60) {
      setAgeMonths(age);
    }
  };
  
  const handleCreateAssessment = async () => {
    if (selectedDomains.length === 0) {
      toast({
        title: "Selecione pelo menos um domínio",
        description: "É necessário selecionar ao menos um domínio para a avaliação",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const assessment = {
        child_id: childId || 'unknown',
        title,
        date: new Date().toISOString(),
        child_age_months: ageMonths,
        domains: selectedDomains,
        completed: false,
        feedback: ''
      };
      
      const newAssessment = await createAssessment(assessment);
      
      if (newAssessment) {
        toast({
          title: "Avaliação criada com sucesso",
          description: "Você será redirecionado para a avaliação"
        });
        navigate(`/assessment/${newAssessment.id}`);
      }
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Erro ao criar avaliação",
        description: "Não foi possível criar a avaliação. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const goToNextTab = () => {
    if (activeTab === 'info') {
      setActiveTab('domains');
    } else if (activeTab === 'domains' && selectedDomains.length > 0) {
      handleCreateAssessment();
    }
  };
  
  const goToPrevTab = () => {
    if (activeTab === 'domains') {
      setActiveTab('info');
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Nova Avaliação | Educare App</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Nova Avaliação de Desenvolvimento</CardTitle>
            <CardDescription>
              Crie uma avaliação personalizada para monitorar o desenvolvimento infantil
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
              <TabsTrigger value="domains">Domínios de Desenvolvimento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Avaliação</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Ex: Avaliação Trimestral"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Idade da Criança (em meses)</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={ageMonths} 
                    onChange={(e) => handleAgeChange(e.target.value)} 
                    min={0}
                    max={60}
                  />
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(ageMonths / 12)} anos e {ageMonths % 12} meses
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={goToNextTab} 
                  className="ml-auto"
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="domains">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione os domínios que deseja incluir nesta avaliação. Cada domínio contém perguntas específicas para a idade selecionada.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {domains.map(domain => (
                      <Button
                        key={domain.id}
                        type="button"
                        variant={selectedDomains.includes(domain.id) ? "default" : "outline"}
                        className={`justify-start ${selectedDomains.includes(domain.id) ? "border-primary" : ""}`}
                        onClick={() => handleDomainToggle(domain.id)}
                      >
                        {selectedDomains.includes(domain.id) && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {domain.label}
                      </Button>
                    ))}
                  </div>
                  
                  {selectedDomains.length === 0 && (
                    <p className="text-sm text-destructive">
                      Por favor, selecione pelo menos um domínio para a avaliação.
                    </p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={goToPrevTab}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                
                <Button 
                  onClick={handleCreateAssessment} 
                  disabled={selectedDomains.length === 0 || loading}
                >
                  {loading ? "Criando..." : "Criar Avaliação"}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default NewAssessmentPage;
