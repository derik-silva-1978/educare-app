
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AnamneseQuestion, AnamneseResponse } from '@/types/assessment';
import { getAllAnamneseQuestions } from '@/utils/anamnese-questions';
import { useToast } from '@/hooks/use-toast';
import AnamneseSection from './AnamneseSection';
import { FileCheck } from 'lucide-react';

interface AnamneseManagerProps {
  childId: string;
  assessmentId: string;
  onComplete: () => void;
}

export const AnamneseManager: React.FC<AnamneseManagerProps> = ({
  childId,
  assessmentId,
  onComplete
}) => {
  const [questions, setQuestions] = useState<AnamneseQuestion[]>([]);
  const [responses, setResponses] = useState<AnamneseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  // Load questions and any existing responses
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        console.log("Loading anamnese data for assessment:", assessmentId);
        
        // Load all anamnese questions
        const allQuestions = getAllAnamneseQuestions();
        setQuestions(allQuestions);
        
        // Here you would typically load responses from your backend
        // For now, we'll use localStorage as a placeholder
        const savedResponses = localStorage.getItem(`anamnese_${assessmentId}`);
        if (savedResponses) {
          const parsedResponses = JSON.parse(savedResponses);
          console.log("Loaded saved responses:", parsedResponses);
          setResponses(parsedResponses);
        } else {
          console.log("No saved responses found");
        }
        
        // Check if the anamnese was already completed
        const completedStatus = localStorage.getItem(`anamnese_${assessmentId}_completed`);
        setIsCompleted(completedStatus === 'true');
        console.log("Completion status:", completedStatus === 'true');
      } catch (error) {
        console.error('Error loading anamnese data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as perguntas da anamnese',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [assessmentId, childId, toast]);

  // Handle saving a response
  const handleSaveResponse = async (response: AnamneseResponse) => {
    try {
      console.log("Saving response:", response);
      // Check if response already exists
      const existingIndex = responses.findIndex(r => r.questionId === response.questionId);
      
      if (existingIndex >= 0) {
        // Update existing response
        const updatedResponses = [...responses];
        updatedResponses[existingIndex] = response;
        setResponses(updatedResponses);
        
        // Save to localStorage (would be backend in real implementation)
        localStorage.setItem(`anamnese_${assessmentId}`, JSON.stringify(updatedResponses));
        console.log("Updated existing response");
      } else {
        // Add new response
        const newResponses = [...responses, response];
        setResponses(newResponses);
        
        // Save to localStorage (would be backend in real implementation)
        localStorage.setItem(`anamnese_${assessmentId}`, JSON.stringify(newResponses));
        console.log("Added new response");
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a resposta',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  // Handle completing the anamnese
  const handleComplete = () => {
    // Mark as completed
    setIsCompleted(true);
    
    // In a real implementation, you would save this state to your backend
    localStorage.setItem(`anamnese_${assessmentId}_completed`, 'true');
    console.log("Anamnese marked as complete");
    
    toast({
      title: 'Anamnese concluída',
      description: 'As informações da anamnese foram salvas com sucesso',
    });
    
    // Call the parent component's onComplete handler
    onComplete();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileCheck className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-xl font-medium mb-2">Anamnese Concluída</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Todas as informações da anamnese foram registradas com sucesso. Obrigado por fornecer essas informações importantes sobre a saúde materna e do recém-nascido.
        </p>
        <Button onClick={onComplete}>
          Continuar para Avaliação
        </Button>
      </div>
    );
  }

  return (
    <AnamneseSection
      questions={questions}
      responses={responses}
      onSaveResponse={handleSaveResponse}
      onComplete={handleComplete}
    />
  );
};

export default AnamneseManager;
