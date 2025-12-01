
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AIAssistantOptions {
  model?: 'gpt-4o-mini' | 'gpt-4o';
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  assistantType?: 'general' | 'titibot' | 'alcibot';
  domainFocus?: string | null;
  includeDomainExpertise?: boolean;
}

export interface AIAssistantResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  assistantType?: string;
  isDataDriven?: boolean;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  assistantType: 'general' | 'titibot' | 'alcibot';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIChildContext {
  childId: string;
  childName: string;
  childAge: number;
  assessmentSummary: string;
  strengths: string[];
  challenges: string[];
  developmentAreas: any[];
  milestones: {
    completed: string[];
    upcoming: string[];
  };
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AIConversation | null>(null);
  const [childContext, setChildContext] = useState<AIChildContext | null>(null);
  const { toast } = useToast();

  const sendPrompt = async (
    prompt: string,
    options?: AIAssistantOptions,
    conversationId?: string,
    childContextData?: AIChildContext
  ): Promise<AIAssistantResponse | null> => {
    setIsLoading(true);
    setError(null);

    const contextToSend = childContextData || childContext;

    try {
      const { data, error: apiError } = await supabase.functions.invoke('ai-assistant', {
        body: {
          prompt,
          options,
          conversationId,
          childContext: contextToSend
        }
      });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to get response from AI assistant');
      }

      return data as AIAssistantResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'AI Assistant Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set child context data to enhance AI assistant responses
   */
  const setChildContextData = (contextData: AIChildContext | null) => {
    setChildContext(contextData);
  };

  const createConversation = (assistantType: 'general' | 'titibot' | 'alcibot' = 'general') => {
    const newConversation: AIConversation = {
      id: crypto.randomUUID(),
      messages: [],
      assistantType,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [...prev, newConversation]);
    setActiveConversation(newConversation);
    return newConversation;
  };

  const addMessageToConversation = (
    conversationId: string, 
    message: Omit<AIMessage, 'id' | 'timestamp'>
  ) => {
    const newMessage: AIMessage = {
      id: crypto.randomUUID(),
      ...message,
      timestamp: new Date()
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date()
            }
          : conv
      )
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => 
        prev ? {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date()
        } : null
      );
    }

    return newMessage;
  };

  const getConversationHistory = (conversationId: string) => {
    return conversations.find(conv => conv.id === conversationId)?.messages || [];
  };

  const switchConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
      return true;
    }
    return false;
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (activeConversation?.id === conversationId) {
      setActiveConversation(conversations.length > 0 ? conversations[0] : null);
    }
  };

  /**
   * Generates insights or suggestions based on assessment data without a user prompt
   */
  const generateInsight = async (
    childContextData: AIChildContext,
    domain?: string,
    assistantType: 'titibot' | 'alcibot' = 'titibot'
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = domain 
        ? `Baseado nos dados de avaliação, dê uma sugestão de atividade para estimular a área de ${domain} desta criança.`
        : 'Baseado nos dados de avaliação, dê uma sugestão personalizada para o desenvolvimento desta criança.';

      const options: AIAssistantOptions = {
        model: 'gpt-4o-mini',
        assistantType: assistantType,
        temperature: 0.7,
        domainFocus: domain,
        includeDomainExpertise: !!domain
      };

      const { data, error: apiError } = await supabase.functions.invoke('ai-assistant', {
        body: {
          prompt,
          options,
          childContext: childContextData
        }
      });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to generate insight');
      }

      const response = data as AIAssistantResponse;
      return response.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'AI Insight Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendPrompt,
    isLoading,
    error,
    conversations,
    activeConversation,
    createConversation,
    addMessageToConversation,
    getConversationHistory,
    switchConversation,
    deleteConversation,
    childContext,
    setChildContextData,
    generateInsight
  };
};

export default useAIAssistant;
