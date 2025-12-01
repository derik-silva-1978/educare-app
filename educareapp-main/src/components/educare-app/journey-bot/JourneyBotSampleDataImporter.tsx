
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Database } from 'lucide-react';

const JourneyBotSampleDataImporter: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const sampleQuestions = [
    // 0-6 months questions
    {
      dimension: 'motor_grosso' as const,
      question_text: 'A criança consegue sustentar a cabeça quando está de bruços?',
      age_min_months: 2,
      age_max_months: 6,
      order_index: 1,
      feedback_yes: 'Que ótimo! Sustentar a cabeça é um marco importante do desenvolvimento motor grosso. Continue estimulando com atividades de bruços supervisionadas.',
      feedback_no: 'Não se preocupe, cada criança tem seu próprio ritmo. Vamos trabalhar para fortalecer os músculos do pescoço com exercícios adequados.',
      feedback_unknown: 'É importante observar esse marco. Tente colocar a criança de bruços por alguns minutos várias vezes ao dia, sempre supervisionado.',
      tips_yes: ['Continue com o tempo de bruços supervisionado', 'Use brinquedos coloridos para encorajar o levantamento da cabeça', 'Converse com a criança durante o tempo de bruços'],
      tips_no: ['Aumente gradualmente o tempo de bruços', 'Consulte o pediatra se houver preocupações', 'Exercite os músculos do pescoço com movimentos suaves'],
      tips_unknown: ['Observe por algumas semanas', 'Registre o progresso diariamente', 'Converse com o pediatra na próxima consulta'],
      concern_level: 2
    },
    {
      dimension: 'linguagem' as const,
      question_text: 'A criança reage aos sons e vozes familiares?',
      age_min_months: 0,
      age_max_months: 4,
      order_index: 2,
      feedback_yes: 'Maravilhoso! A reação aos sons é fundamental para o desenvolvimento da linguagem. Continue estimulando!',
      feedback_no: 'Vamos trabalhar a estimulação auditiva. É importante expor a criança a diferentes sons de forma suave.',
      feedback_unknown: 'Continue observando as reações. Cada criança responde de forma diferente aos estímulos sonoros.',
      tips_yes: ['Continue falando e cantando para a criança', 'Use diferentes tons de voz', 'Leia historinhas em voz alta'],
      tips_no: ['Aumente a exposição a sons variados', 'Fale mais próximo à criança', 'Use músicas suaves'],
      tips_unknown: ['Observe reações por mais tempo', 'Teste com sons diferentes', 'Anote qualquer resposta'],
      concern_level: 2
    },
    // 6-12 months questions
    {
      dimension: 'motor_grosso' as const,
      question_text: 'A criança consegue sentar sem apoio?',
      age_min_months: 6,
      age_max_months: 10,
      order_index: 3,
      feedback_yes: 'Excelente! Sentar sem apoio é um grande marco do desenvolvimento motor. Continue oferecendo oportunidades para praticar.',
      feedback_no: 'Não se preocupe, vamos fortalecer os músculos necessários para sentar com exercícios apropriados.',
      feedback_unknown: 'Continue observando e oferecendo oportunidades para praticar sentar com apoio gradual.',
      tips_yes: ['Ofereça brinquedos na posição sentada', 'Use almofadas para apoio gradual', 'Celebre cada tentativa'],
      tips_no: ['Pratique posição sentada com apoio', 'Fortaleça músculos do core', 'Use superfícies macias para segurança'],
      tips_unknown: ['Continue oferecendo oportunidades', 'Observe o progresso semanalmente', 'Mantenha ambiente seguro'],
      concern_level: 1
    },
    {
      dimension: 'linguagem' as const,
      question_text: 'A criança balbucia combinações como "mama" ou "papa"?',
      age_min_months: 6,
      age_max_months: 12,
      order_index: 4,
      feedback_yes: 'Que maravilha! O balbucio é o precursor das primeiras palavras. Continue estimulando!',
      feedback_no: 'Vamos estimular mais a vocalização e o balbucio com atividades divertidas.',
      feedback_unknown: 'Continue observando e estimulando. Cada criança tem seu ritmo de desenvolvimento da fala.',
      tips_yes: ['Repita os sons que a criança faz', 'Nomeie objetos e pessoas', 'Leia livros diariamente'],
      tips_no: ['Fale mais durante atividades diárias', 'Use músicas e canções', 'Responda a qualquer vocalização'],
      tips_unknown: ['Continue estímulos por algumas semanas', 'Observe em diferentes situações', 'Registre progressos'],
      concern_level: 1
    },
    // 12-24 months questions
    {
      dimension: 'motor_grosso' as const,
      question_text: 'A criança consegue andar sozinha pelo menos alguns passos?',
      age_min_months: 12,
      age_max_months: 18,
      order_index: 5,
      feedback_yes: 'Excelente! O desenvolvimento motor está progredindo muito bem! Continue incentivando a exploração.',
      feedback_no: 'Não há problema, alguns bebês demoram um pouco mais para andar. Vamos continuar estimulando.',
      feedback_unknown: 'Observe se a criança já consegue se apoiar em móveis para ficar de pé e dar passos com apoio.',
      tips_yes: ['Incentive a criança a andar descalça', 'Crie obstáculos seguros para ela contornar', 'Brinque de perseguir'],
      tips_no: ['Deixe a criança brincar no chão mais tempo', 'Ajude-a a se apoiar em móveis', 'Use brinquedos que incentivem o movimento'],
      tips_unknown: ['Veja se ela consegue ficar de pé sozinha', 'Observe se ela se desloca segurando móveis', 'Note se ela tenta dar passos com apoio'],
      concern_level: 0
    },
    {
      dimension: 'social_emocional' as const,
      question_text: 'A criança sorri em resposta ao sorriso de outras pessoas?',
      age_min_months: 2,
      age_max_months: 6,
      order_index: 6,
      feedback_yes: 'Que lindo! O sorriso social é um marco maravilhoso do desenvolvimento emocional.',
      feedback_no: 'Vamos trabalhar para estimular mais interações sociais positivas com carinho e paciência.',
      feedback_unknown: 'Continue observando em diferentes momentos do dia. Alguns bebês são mais sociais em certas horas.',
      tips_yes: ['Continue sorrindo e fazendo caretas alegres', 'Brinque de "achou!" (peekaboo)', 'Use espelhos para autoconhecimento'],
      tips_no: ['Passe mais tempo face a face', 'Use expressões exageradas', 'Seja paciente e persistente'],
      tips_unknown: ['Observe em momentos quando a criança está alerta', 'Tente em diferentes horários', 'Registre qualquer resposta social'],
      concern_level: 2
    }
  ];

  const importSampleData = async () => {
    setIsImporting(true);
    try {
      // First check if questions already exist
      const { data: existingQuestions } = await supabase
        .from('journey_bot_questions')
        .select('id')
        .limit(1);

      if (existingQuestions && existingQuestions.length > 0) {
        toast({
          title: "Dados já existem",
          description: "Já existem perguntas no banco de dados. Importação cancelada.",
          variant: "destructive"
        });
        return;
      }

      // Import sample questions
      const { error } = await supabase
        .from('journey_bot_questions')
        .insert(sampleQuestions);

      if (error) {
        throw error;
      }

      toast({
        title: "Dados importados com sucesso!",
        description: `${sampleQuestions.length} perguntas foram adicionadas ao Journey Bot.`
      });
    } catch (error: any) {
      console.error('Error importing sample data:', error);
      toast({
        title: "Erro ao importar dados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dados de Exemplo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Importe perguntas de exemplo para testar o Journey Bot com diferentes faixas etárias.
        </p>
        <Button 
          onClick={importSampleData} 
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Importar Dados de Exemplo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JourneyBotSampleDataImporter;
