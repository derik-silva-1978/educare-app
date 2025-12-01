
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuizAssistantRequest {
  domain: string;
  questions?: any[];
  studentContext?: string;
  prompt: string;
}

interface QuizAssistantResponse {
  answer: string;
  suggestions: string[];
  resources: { title: string; url: string }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract the request data
    const { domain, questions = [], studentContext = "", prompt } = await req.json() as QuizAssistantRequest;

    // Log the request for debugging
    console.log("Quiz Assistant Request:", { domain, questionCount: questions.length, studentContext, prompt });

    // Generate domain-specific content for different domains
    const domainSpecificContent: Record<string, QuizAssistantResponse> = {
      motor: {
        answer: `Para o desenvolvimento motor, recomendamos atividades que estimulem a coordenação motora fina e grossa. ${studentContext ? `Considerando o contexto: ${studentContext}, ` : ''}é importante proporcionar oportunidades para movimentos livres e direcionados.`,
        suggestions: [
          "Atividades de encaixe com peças de diferentes tamanhos e formas",
          "Circuitos de obstáculos com desafios motores adequados à idade",
          "Jogos de imitação de movimentos de animais para estimular diferentes grupos musculares",
          "Brincadeiras com bolas de diferentes tamanhos e texturas"
        ],
        resources: [
          { title: "Guia de atividades motoras para educação infantil", url: "https://www.scielo.br/j/motriz/" },
          { title: "Desenvolvimento motor na primeira infância", url: "https://revistas.ufpr.br/cogitare/" }
        ]
      },
      cognitive: {
        answer: `O desenvolvimento cognitivo envolve a capacidade de resolver problemas, raciocinar e compreender conceitos. ${studentContext ? `No contexto informado: ${studentContext}, ` : ''}sugerimos atividades que estimulem a curiosidade e o pensamento lógico.`,
        suggestions: [
          "Jogos de categorização e classificação de objetos",
          "Atividades de causa e efeito com elementos cotidianos",
          "Quebra-cabeças progressivos de acordo com o nível de desenvolvimento",
          "Jogos de memória adaptados com elementos de interesse da criança"
        ],
        resources: [
          { title: "Estratégias para estimulação cognitiva", url: "https://www.scielo.br/j/ptp/" },
          { title: "Desenvolvimento do pensamento lógico na infância", url: "https://periodicos.ufsm.br/educacaoespecial/" }
        ]
      },
      language: {
        answer: `Para estimular o desenvolvimento da linguagem, ${studentContext ? `considerando o contexto: ${studentContext}, ` : ''}é fundamental oferecer um ambiente rico em estímulos linguísticos, com interações significativas e variadas.`,
        suggestions: [
          "Leitura diária de histórias com participação ativa da criança",
          "Jogos de nomeação e descrição de objetos e imagens",
          "Canções com gestos e repetição para associação de palavras e movimentos",
          "Conversas contextualizadas durante atividades cotidianas"
        ],
        resources: [
          { title: "Guia de desenvolvimento da linguagem", url: "https://www.scielo.br/j/codas/" },
          { title: "Atividades práticas para estimulação da linguagem", url: "https://www.sbfa.org.br/portal/" }
        ]
      },
      social: {
        answer: `O desenvolvimento social envolve aprender a interagir com os outros de forma adequada e construtiva. ${studentContext ? `Baseado no contexto informado: ${studentContext}, ` : ''}é importante proporcionar oportunidades de interação com crianças e adultos.`,
        suggestions: [
          "Brincadeiras que envolvam cooperação e compartilhamento",
          "Jogos de regras simples para aprender sobre limites e convivência",
          "Atividades em pequenos grupos com objetivos comuns",
          "Dramatizações de situações sociais para praticar habilidades sociais"
        ],
        resources: [
          { title: "Desenvolvimento de habilidades sociais na infância", url: "https://www.scielo.br/j/prc/" },
          { title: "Estratégias para promover a interação social", url: "https://www.scielo.br/j/rbee/" }
        ]
      },
      communication: {
        answer: `A comunicação efetiva envolve a capacidade de expressar necessidades, desejos e ideias. ${studentContext ? `No contexto específico: ${studentContext}, ` : ''}sugerimos trabalhar tanto a comunicação receptiva quanto expressiva.`,
        suggestions: [
          "Uso de pranchas de comunicação com imagens de interesse",
          "Jogos de imitação de expressões faciais e gestos",
          "Atividades de seguir instruções simples e depois complexas",
          "Narração de histórias com apoio visual e participação ativa"
        ],
        resources: [
          { title: "Comunicação alternativa na prática pedagógica", url: "https://www.scielo.br/j/rbee/" },
          { title: "Estratégias para desenvolvimento da comunicação", url: "https://www.scielo.br/j/cp/" }
        ]
      },
      social_emotional: {
        answer: `O desenvolvimento socioemocional envolve o reconhecimento e regulação das emoções próprias e alheias. ${studentContext ? `Considerando o contexto: ${studentContext}, ` : ''}é importante trabalhar a expressão adequada das emoções.`,
        suggestions: [
          "Leitura de histórias com foco nas emoções dos personagens",
          "Jogos de reconhecimento e nomeação de emoções",
          "Atividades de respiração e relaxamento para autorregulação",
          "Criação de mural das emoções para registro diário"
        ],
        resources: [
          { title: "Desenvolvimento socioemocional na primeira infância", url: "https://www.scielo.br/j/ptp/" },
          { title: "Guia prático de educação socioemocional", url: "https://novaeducacao.org.br/" }
        ]
      },
      self_care: {
        answer: `As habilidades de autocuidado são fundamentais para a autonomia. ${studentContext ? `No contexto informado: ${studentContext}, ` : ''}é importante ensinar gradualmente as habilidades de cuidados pessoais.`,
        suggestions: [
          "Atividades estruturadas de higiene pessoal com apoio visual",
          "Jogos de vestir e despir com diferentes tipos de fechamento",
          "Criação de rotinas visuais para tarefas de autocuidado",
          "Simulações de situações cotidianas com objetos reais"
        ],
        resources: [
          { title: "Desenvolvimento de habilidades de vida diária", url: "https://www.scielo.br/j/rbee/" },
          { title: "Estratégias para promover a autonomia na infância", url: "https://periodicos.ufsm.br/educacaoespecial/" }
        ]
      },
      maternal_health: {
        answer: `A saúde materna influencia diretamente o desenvolvimento infantil. ${studentContext ? `Considerando o contexto: ${studentContext}, ` : ''}é importante considerar aspectos físicos e emocionais do bem-estar materno.`,
        suggestions: [
          "Criação de rede de apoio social e familiar",
          "Atividades de relaxamento e gestão do estresse",
          "Acesso a informações sobre saúde e desenvolvimento infantil",
          "Grupos de apoio e troca de experiências entre mães"
        ],
        resources: [
          { title: "Saúde materna e desenvolvimento infantil", url: "https://www.scielo.br/j/csp/" },
          { title: "Estratégias de apoio à saúde mental materna", url: "https://www.scielo.br/j/tce/" }
        ]
      }
    };

    // Generate default response for any domain not specifically covered
    const defaultResponse: QuizAssistantResponse = {
      answer: `Para o domínio de desenvolvimento solicitado, ${studentContext ? `considerando o contexto: ${studentContext}, ` : ''}recomendamos atividades estruturadas e progressivas.`,
      suggestions: [
        "Criar rotinas previsíveis com apoios visuais",
        "Oferecer atividades que respeitem o nível atual de desenvolvimento",
        "Usar reforço positivo para celebrar conquistas",
        "Adaptar materiais e ambiente para garantir acessibilidade"
      ],
      resources: [
        { title: "Estratégias para educação inclusiva", url: "https://www.scielo.br/j/rbee/" },
        { title: "Guia de adaptações curriculares", url: "https://diversa.org.br/" }
      ]
    };

    // Use domain-specific content if available, otherwise use default
    const response = domainSpecificContent[domain] || defaultResponse;

    // Enhance the response with question-specific content if available
    if (questions.length > 0) {
      response.answer += ` Observamos que foram registradas ${questions.length} questões neste domínio, o que nos ajuda a personalizar melhor as recomendações.`;
    }

    // Enhance with prompt-specific content
    if (prompt && prompt !== `Preciso de sugestões de atividades para o domínio ${domain}`) {
      response.answer += ` Quanto à sua solicitação específica: "${prompt}", podemos complementar nossas sugestões considerando essa necessidade particular.`;
      response.suggestions.push("Consulta com especialistas para avaliação e orientações personalizadas");
    }

    // Log the response for debugging
    console.log("Generated response:", { domain, responseLength: response.answer.length });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in quiz-assistant function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Ocorreu um erro ao processar sua solicitação.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
