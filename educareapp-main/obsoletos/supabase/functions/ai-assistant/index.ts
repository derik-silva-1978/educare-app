
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get the OpenAI API key from environment variable
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Conversation {
  id: string;
  messages: Message[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChildAssessmentData {
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

interface RequestBody {
  prompt: string;
  options?: {
    model?: 'gpt-4o-mini' | 'gpt-4o';
    systemMessage?: string;
    temperature?: number;
    maxTokens?: number;
    assistantType?: 'general' | 'titibot' | 'alcibot';
    domainFocus?: string; // The specific developmental domain to focus on
    includeDomainExpertise?: boolean; // Whether to add domain-specific expertise
  };
  conversationId?: string;
  conversation?: Conversation;
  childContext?: ChildAssessmentData; // Child assessment data for personalized responses
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request data
    const requestBody: RequestBody = await req.json();
    const { prompt, options, conversation, childContext } = requestBody;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the model and system message
    const model = options?.model || 'gpt-4o-mini';
    let systemMessage = options?.systemMessage || 'You are a helpful assistant designed to provide accurate and relevant information.';
    const temperature = options?.temperature || 0.7;
    const maxTokens = options?.maxTokens || 1000;
    const assistantType = options?.assistantType || 'general';
    const domainFocus = options?.domainFocus;
    const includeDomainExpertise = options?.includeDomainExpertise || false;

    // Customize system message based on assistant type and child context
    if (assistantType === 'titibot') {
      if (childContext) {
        // Enhanced system message with child-specific data
        systemMessage = `Você é Titibot, um coach de desenvolvimento infantil especializado em crianças de 0 a 36 meses.
        
Você está conversando com a família de ${childContext.childName}, uma criança de ${childContext.childAge} meses.

Informações sobre ${childContext.childName}:
- ${childContext.assessmentSummary}
`;

        if (childContext.strengths.length > 0) {
          systemMessage += `\nPontos fortes:\n${childContext.strengths.map(s => `- ${s}`).join('\n')}\n`;
        }
        
        if (childContext.challenges.length > 0) {
          systemMessage += `\nÁreas para desenvolver:\n${childContext.challenges.map(c => `- ${c}`).join('\n')}\n`;
        }

        // Add domain expertise if requested
        if (includeDomainExpertise && domainFocus) {
          const domainArea = childContext.developmentAreas.find(area => 
            area.domain === domainFocus || area.displayName.toLowerCase() === domainFocus.toLowerCase()
          );
          
          if (domainArea) {
            systemMessage += `\nVocê está atuando como especialista na área de ${domainArea.displayName}. Foque suas respostas em orientações detalhadas e baseadas em evidências científicas para esta área específica do desenvolvimento infantil.\n`;
            
            // Add domain-specific items
            if (domainArea.items && domainArea.items.length > 0) {
              systemMessage += `\nInformações específicas sobre ${domainArea.displayName} para ${childContext.childName}:\n`;
              domainArea.items.forEach(item => {
                systemMessage += `- ${item.strength ? 'Ponto forte' : 'Ponto a desenvolver'}: ${item.description}\n`;
              });
            }
          }
        }
        
        systemMessage += `\nSeu foco é auxiliar com orientações práticas, atividades de estímulo adequadas à idade da criança,
e ajudar a identificar marcos importantes do desenvolvimento. Responda de forma amigável mas informativa,
sempre baseando-se em evidências científicas atuais sobre desenvolvimento infantil e os dados específicos desta criança.`;
      } else {
        // Default system message when no child data is available
        systemMessage = `Você é Titibot, um coach de desenvolvimento infantil especializado em crianças de 0 a 36 meses.
Seu foco é auxiliar pais e cuidadores com orientações práticas, atividades de estímulo adequadas à idade da criança,
e ajudar a identificar marcos importantes do desenvolvimento. Responda de forma amigável mas informativa,
sempre baseando-se em evidências científicas atuais sobre desenvolvimento infantil.`;
      }
    } else if (assistantType === 'alcibot') {
      if (childContext) {
        // Enhanced system message with child-specific data for mothers
        systemMessage = `Você é AlciBot, um assistente especializado em saúde materna para acompanhar gestantes e mães no pós-parto.

Você está conversando com uma mãe de ${childContext.childName}, uma criança de ${childContext.childAge} meses.

Seu tom é sempre calmo, empático e acolhedor. Você fornece orientações baseadas em evidências científicas atuais,
ajuda a compreender sintomas comuns na gestação, oferece suporte emocional, e auxilia com informações práticas
sobre o desenvolvimento da gravidez, cuidados no pós-parto e desenvolvimento infantil inicial.`;
      } else {
        // Default system message
        systemMessage = `Você é AlciBot, um assistente especializado em saúde materna para acompanhar gestantes e mães no pós-parto.
Seu tom é sempre calmo, empático e acolhedor. Você fornece orientações baseadas em evidências científicas atuais,
ajuda a compreender sintomas comuns na gestação, oferece suporte emocional, e auxilia com informações práticas
sobre o desenvolvimento da gravidez e cuidados no pós-parto.`;
      }
    }

    console.log(`Processing ${assistantType} request with model: ${model}`);
    
    // Prepare messages for the API call
    const messages: Message[] = [];
    
    // Add system message
    messages.push({ role: 'system', content: systemMessage });
    
    // Add conversation history if provided
    if (conversation && conversation.messages && conversation.messages.length > 0) {
      // Add up to the last 10 messages from the conversation to maintain context
      // but avoid hitting token limits
      const recentMessages = conversation.messages.slice(-10);
      messages.push(...recentMessages);
    }
    
    // Add the current user prompt
    messages.push({ role: 'user', content: prompt });
    
    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    });

    const result = await response.json();

    // Check for errors in the OpenAI response
    if (result.error) {
      console.error('OpenAI API error:', result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedText = result.choices[0].message.content;
    
    // Add information about whether the response was data-driven
    const isDataDriven = !!childContext;
    
    return new Response(
      JSON.stringify({ 
        response: generatedText,
        usage: result.usage,
        model: model,
        assistantType: assistantType,
        isDataDriven: isDataDriven
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
