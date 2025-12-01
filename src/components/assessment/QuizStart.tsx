
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DomainLabels, DevelopmentDomain } from '@/types/assessment';
import { ArrowRight, CheckCircle } from 'lucide-react';
import useAssessmentService from '@/hooks/useAssessmentService';
import { useToast } from '@/hooks/use-toast';

interface QuizStartProps {
  childId: string;
  childName: string;
  childAgeMonths: number;
}

export const QuizStart: React.FC<QuizStartProps> = ({
  childId,
  childName,
  childAgeMonths
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createAssessment, loading } = useAssessmentService();
  
  const [title, setTitle] = useState(`Avaliação de ${childName}`);
  const [selectedDomains, setSelectedDomains] = useState<DevelopmentDomain[]>([
    'communication',
    'motor',
    'social_emotional',
    'cognitive',
    'self_care'
  ]);
  
  const allDomains: DevelopmentDomain[] = [
    'communication',
    'motor',
    'social_emotional',
    'cognitive',
    'self_care',
    'maternal_health'
  ];
  
  const handleDomainToggle = (domain: DevelopmentDomain) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain);
      } else {
        return [...prev, domain];
      }
    });
  };
  
  const handleStartAssessment = async () => {
    if (!title.trim()) {
      toast({
        title: 'Título necessário',
        description: 'Por favor, digite um título para a avaliação',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedDomains.length === 0) {
      toast({
        title: 'Selecione pelo menos um domínio',
        description: 'Por favor, selecione pelo menos um domínio para avaliar',
        variant: 'destructive',
      });
      return;
    }
    
    const newAssessment = {
      child_id: childId,
      title: title.trim(),
      date: new Date().toISOString(),
      child_age_months: childAgeMonths,
      completed: false,
      domains: selectedDomains,
      feedback: ''
    };
    
    const created = await createAssessment(newAssessment);
    if (created) {
      toast({
        title: 'Avaliação iniciada',
        description: 'Vamos começar a avaliação do desenvolvimento',
      });
      navigate(`/assessment/${created.id}`);
    }
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Nova Avaliação de Desenvolvimento</CardTitle>
        <CardDescription>
          Avalie o desenvolvimento de {childName} em várias áreas importantes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título da avaliação</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Avaliação trimestral"
          />
        </div>
        
        <div className="space-y-3">
          <Label>Domínios a avaliar</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allDomains.map((domain) => (
              <div key={domain} className="flex items-center space-x-2">
                <Checkbox 
                  id={domain}
                  checked={selectedDomains.includes(domain)}
                  onCheckedChange={() => handleDomainToggle(domain)}
                />
                <Label htmlFor={domain} className="cursor-pointer">
                  {DomainLabels[domain]}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Informações da criança
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nome:</p>
              <p className="text-muted-foreground">{childName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Idade:</p>
              <p className="text-muted-foreground">{childAgeMonths} meses</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button
          onClick={handleStartAssessment}
          disabled={loading || selectedDomains.length === 0 || !title.trim()}
        >
          {loading ? 'Criando...' : 'Iniciar Avaliação'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizStart;
