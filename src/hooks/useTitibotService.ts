
export interface TitibotHistoryItem {
  sender: 'user' | 'bot';
  message: string;
  timestamp: number;
}

export interface TitibotService {
  sendMessage: (message: string, premium?: boolean) => Promise<string>;
  getHistory: () => TitibotHistoryItem[];
  clearHistory: () => void;
  isPremium: boolean;
}

export const useTitibotService = (premiumAccess: boolean = false): TitibotService => {
  // In a real app, this would connect to an API and retrieve previous history
  const isPremium = premiumAccess;
  
  const sendMessage = async (message: string, premium: boolean = false): Promise<string> => {
    // This is a mock implementation. In a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (premium || isPremium) {
          // TitiBotTurbo - premium response with more detail (in Portuguese)
          const premiumResponses = {
            pei: "O Plano Educacional Individualizado (PEI) é um documento pedagógico que orienta o processo de ensino-aprendizagem de estudantes com necessidades educacionais específicas. Para criar um PEI eficaz, siga estas etapas detalhadas: 1) Avalie o estudante em todas as áreas de desenvolvimento; 2) Defina objetivos específicos, mensuráveis e realistas; 3) Estabeleça estratégias diversificadas; 4) Determine recursos necessários; 5) Estabeleça cronograma de avaliação e ajustes. Posso ajudar você com modelos de PEI específicos para diferentes condições ou necessidades educacionais.",
            relatório: "Os relatórios no Smart PEI possuem múltiplas funcionalidades e formatos. Você pode gerar: 1) Relatórios de progresso individual, que mostram o desenvolvimento do aluno ao longo do tempo; 2) Relatórios comparativos, que permitem visualizar o desempenho em diferentes áreas; 3) Relatórios de intervenção, que destacam as estratégias aplicadas e seus resultados; 4) Relatórios para famílias, com linguagem acessível. Cada relatório pode ser exportado em PDF, Excel ou apresentado em gráficos interativos. Posso ajudar você a configurar relatórios personalizados para necessidades específicas da sua instituição.",
            default: "Como TitiBotTurbo, posso fornecer respostas detalhadas, análises aprofundadas e orientações específicas sobre o Smart PEI. Além de respostas completas, posso gerar sugestões personalizadas, materiais de apoio e estratégias baseadas em evidências científicas. Como posso ajudar você hoje com recursos premium?"
          };
          
          // Match keywords in the message to determine the appropriate response
          if (message.toLowerCase().includes('pei') || message.toLowerCase().includes('plano')) {
            resolve(premiumResponses.pei);
          } else if (message.toLowerCase().includes('relatório') || message.toLowerCase().includes('relatorio')) {
            resolve(premiumResponses.relatório);
          } else {
            resolve(premiumResponses.default);
          }
        } else {
          // Regular TitiBot - concise response (in Portuguese)
          const standardResponses = {
            pei: "Para criar um PEI, acesse o perfil do aluno e selecione 'Novo PEI'. Siga as etapas do assistente para definir objetivos e estratégias personalizadas.",
            relatório: "Você pode gerar relatórios na seção 'Relatórios'. Selecione o tipo desejado, o período e os alunos para análise.",
            default: "Olá! Sou o TitiBot. Posso ajudar com dúvidas básicas sobre o Smart PEI. Para recursos avançados e análises detalhadas, considere atualizar para o TitiBotTurbo."
          };
          
          if (message.toLowerCase().includes('pei') || message.toLowerCase().includes('plano')) {
            resolve(standardResponses.pei);
          } else if (message.toLowerCase().includes('relatório') || message.toLowerCase().includes('relatorio')) {
            resolve(standardResponses.relatório);
          } else {
            resolve(standardResponses.default);
          }
        }
      }, 1000);
    });
  };

  const getHistory = (): TitibotHistoryItem[] => {
    // This would fetch from localstorage or state management in a real app
    return [];
  };

  const clearHistory = () => {
    // This would clear history in a real app
  };

  return {
    sendMessage,
    getHistory,
    clearHistory,
    isPremium
  };
};

export default useTitibotService;
