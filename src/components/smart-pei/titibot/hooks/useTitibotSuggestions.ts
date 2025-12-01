
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useTitibotSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const location = useLocation();
  
  useEffect(() => {
    // Generate suggestions based on the current route
    const path = location.pathname;
    let routeSuggestions: string[] = [];
    
    if (path.includes('/dashboard')) {
      routeSuggestions = [
        "Como interpretar os gráficos?",
        "O que significa esse indicador?",
        "Como exportar relatórios?",
        "Como personalizar o dashboard?"
      ];
    } else if (path.includes('/students')) {
      routeSuggestions = [
        "Como adicionar um novo aluno?",
        "Como criar um PEI?",
        "Como filtrar a lista de alunos?",
        "Quais informações são necessárias para o cadastro?"
      ];
    } else if (path.includes('/pei')) {
      routeSuggestions = [
        "Como adicionar objetivos ao PEI?",
        "Como registrar o progresso?",
        "Quais são as melhores práticas para um PEI?",
        "Como compartilhar o PEI com outros profissionais?"
      ];
    } else if (path.includes('/reports')) {
      routeSuggestions = [
        "Como gerar um relatório de progresso?",
        "Quais tipos de relatórios estão disponíveis?",
        "Como exportar relatórios?",
        "Como personalizar o formato do relatório?"
      ];
    } else if (path.includes('/activities')) {
      routeSuggestions = [
        "Como planejar uma atividade?",
        "Como vincular atividades aos objetivos do PEI?",
        "Como organizar o cronograma de atividades?",
        "Quais atividades são recomendadas para TEA?"
      ];
    } else {
      // Default suggestions
      routeSuggestions = [
        "Como posso ajudar você hoje?",
        "O que você gostaria de saber sobre o Smart PEI?",
        "Precisa de ajuda com alguma funcionalidade específica?",
        "Quer saber mais sobre o Titibot Turbo?"
      ];
    }
    
    setSuggestions(routeSuggestions);
  }, [location.pathname]);
  
  return { suggestions };
};
