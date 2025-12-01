
import { AnamneseQuestion } from '@/types/assessment';

// Function to return all anamnese questions
export const getAllAnamneseQuestions = (): AnamneseQuestion[] => {
  return [
    {
      id: 'prenatal_care',
      category: 'Cuidados Pré-Natais',
      question: 'Você realizou acompanhamento pré-natal regularmente durante a gravidez?',
      options: ['Sim', 'Não', 'Parcialmente'],
      required: true,
      friendlyDescription: 'O acompanhamento pré-natal é importante para monitorar a saúde da mãe e do bebê durante a gestação.',
      positiveFeeback: 'O acompanhamento pré-natal regular é essencial para o desenvolvimento saudável do bebê.',
      motherTips: 'Continue mantendo consultas regulares com seu médico para monitorar sua saúde e a do seu bebê.'
    },
    {
      id: 'pregnancy_complications',
      category: 'Complicações Gestacionais',
      question: 'Houve alguma complicação durante a gravidez?',
      options: ['Sim', 'Não'],
      required: true,
      friendlyDescription: 'Complicações podem incluir diabetes gestacional, hipertensão, sangramentos, entre outros.',
      motherTips: 'Caso tenha ocorrido alguma complicação, é importante compartilhar essas informações com os profissionais de saúde que acompanham seu filho.'
    },
    {
      id: 'birth_term',
      category: 'Nascimento',
      question: 'O nascimento ocorreu a termo (entre 37 e 42 semanas)?',
      options: ['Sim', 'Não (prematuro)', 'Não (pós-termo)'],
      required: true,
      friendlyDescription: 'Bebês prematuros nascem antes de 37 semanas e pós-termo após 42 semanas de gestação.',
      motherTips: 'Bebês prematuros podem precisar de acompanhamento especial do desenvolvimento.'
    },
    {
      id: 'delivery_type',
      category: 'Nascimento',
      question: 'Qual foi o tipo de parto?',
      options: ['Normal/Vaginal', 'Cesárea', 'Auxiliado (fórceps/vácuo)'],
      required: true
    },
    {
      id: 'birth_weight',
      category: 'Nascimento',
      question: 'Qual foi o peso ao nascer?',
      options: ['Menos de 2,5kg', 'Entre 2,5kg e 4kg', 'Mais de 4kg'],
      required: true,
      motherTips: 'O peso ao nascer pode influenciar aspectos do desenvolvimento infantil.'
    }
  ];
};
