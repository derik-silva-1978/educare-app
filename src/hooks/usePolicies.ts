import { useState, useCallback } from 'react';

export type PolicyType = 'privacy' | 'terms' | 'lgpd' | 'cookies';

const policyContent: Record<PolicyType, { title: string; content: string }> = {
  privacy: {
    title: 'Política de Privacidade',
    content: 'A Educare+ respeita a sua privacidade e está comprometida em proteger seus dados pessoais. Esta política descreve como coletamos, usamos e protegemos suas informações ao utilizar nossa plataforma.\n\n1. Coleta de Dados: Coletamos informações fornecidas por você durante o cadastro e uso da plataforma, incluindo dados de perfil, informações sobre crianças cadastradas e interações com o TitiNauta.\n\n2. Uso dos Dados: Seus dados são utilizados exclusivamente para personalizar sua experiência, fornecer orientações adequadas e melhorar nossos serviços.\n\n3. Compartilhamento: Não compartilhamos seus dados pessoais com terceiros sem seu consentimento expresso.\n\n4. Segurança: Utilizamos criptografia avançada e medidas de segurança para proteger suas informações.\n\n5. Seus Direitos: Você pode acessar, corrigir ou excluir seus dados a qualquer momento através das configurações da sua conta.'
  },
  terms: {
    title: 'Termos de Uso',
    content: 'Ao utilizar a plataforma Educare+, você concorda com os seguintes termos:\n\n1. Uso da Plataforma: A Educare+ é uma ferramenta de apoio ao desenvolvimento infantil e saúde materna. Não substitui orientação médica profissional.\n\n2. Cadastro: Você é responsável pelas informações fornecidas durante o cadastro e deve manter seus dados atualizados.\n\n3. Conteúdo: Todo conteúdo da plataforma é baseado em evidências científicas, mas deve ser utilizado como complemento, não substituto, de acompanhamento profissional.\n\n4. Propriedade Intelectual: Todo conteúdo da plataforma é protegido por direitos autorais e não pode ser reproduzido sem autorização.\n\n5. Responsabilidade: A Educare+ não se responsabiliza por decisões tomadas exclusivamente com base nas orientações da plataforma.'
  },
  lgpd: {
    title: 'Conformidade LGPD',
    content: 'A Educare+ está em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).\n\n1. Base Legal: O tratamento de dados pessoais é realizado com base no consentimento do titular e para execução de contrato.\n\n2. Direitos do Titular: Você tem direito a confirmação da existência de tratamento, acesso aos dados, correção, anonimização, portabilidade e eliminação.\n\n3. Encarregado de Dados (DPO): Para questões relacionadas à proteção de dados, entre em contato através do e-mail contato@educaremais.com.br.\n\n4. Transferência Internacional: Não realizamos transferência internacional de dados pessoais.\n\n5. Incidentes de Segurança: Em caso de incidente de segurança que possa acarretar risco aos titulares, notificaremos a ANPD e os titulares afetados.'
  },
  cookies: {
    title: 'Política de Cookies',
    content: 'A Educare+ utiliza cookies para melhorar sua experiência na plataforma.\n\n1. Cookies Essenciais: Necessários para o funcionamento básico da plataforma, incluindo autenticação e segurança.\n\n2. Cookies de Desempenho: Coletam informações sobre como você usa a plataforma para nos ajudar a melhorá-la.\n\n3. Cookies de Funcionalidade: Permitem que a plataforma lembre suas preferências e configurações.\n\n4. Gerenciamento: Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.\n\n5. Consentimento: Ao continuar navegando, você consente com o uso de cookies conforme descrito nesta política.'
  }
};

export function usePolicies() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<{ title: string; content: string } | null>(null);

  const openPolicy = useCallback((type: PolicyType) => {
    setCurrentPolicy(policyContent[type]);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrentPolicy(null);
  }, []);

  return { isOpen, currentPolicy, openPolicy, closeModal };
}
