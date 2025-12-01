
import React from 'react';
import PricingCard, { PricingPlan } from './PricingCard';
import { Users, Shield, FileText, BadgeCheck, HeartHandshake } from 'lucide-react';

// Define plans data for export - Educare App
export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Plano Gratuito",
    description: "Perfeito para começar a jornada de desenvolvimento",
    price: "Grátis",
    period: "30 dias",
    annualPrice: "Sempre gratuito",
    save: "Teste grátis",
    popular: false,
    color: "bg-educare-300",
    borderColor: "border-educare-300/20",
    icon: <Users className="h-5 w-5" />,
    studentLimit: "1 perfil de criança",
    features: [
      "1 perfil de criança",
      "Jornada TitiNauta com Assistente IA (Web e WhatsApp)",
      "Acesso ao Blog",
      "Avaliações básicas",
      "Suporte via chat"
    ]
  },
  {
    id: 2,
    name: "Plano Básico",
    description: "Ideal para pais que querem acompanhar o desenvolvimento",
    price: "R$ 19,90",
    period: "por mês",
    annualPrice: "R$ 199,90/ano",
    save: "Economize 17%",
    popular: false,
    color: "bg-educare-500",
    borderColor: "border-educare-500/20",
    icon: <HeartHandshake className="h-5 w-5" />,
    studentLimit: "1 perfil de criança",
    features: [
      "1 perfil de criança",
      "Jornada TitiNauta com Assistente IA (somente na web)",
      "Relatórios Básicos",
      "Acesso à Educare+ Academy",
      "Acesso ao Blog",
      "Notificações de progresso"
    ]
  },
  {
    id: 3,
    name: "Plano Premium",
    description: "Experiência completa com suporte especializado",
    price: "R$ 29,00",
    period: "por mês",
    annualPrice: "R$ 299,00/ano",
    save: "Economize 17%",
    popular: true,
    color: "bg-educare-600",
    borderColor: "border-educare-600/20",
    icon: <BadgeCheck className="h-5 w-5" />,
    studentLimit: "1 perfil de criança",
    features: [
      "1 perfil de criança",
      "Jornada TitiNauta com Assistente IA (Web e WhatsApp)",
      "Relatórios Detalhados e Compartilhamento com Profissionais",
      "Acesso à Educare+ Academy",
      "Acesso ao Blog",
      "Grupos de Pais e Mães com apoio exclusivo da Equipe Educare+",
      "Lives e Mentorias Coletivas"
    ]
  },
  {
    id: 4,
    name: "Plano Empresarial",
    description: "Solução completa para profissionais e instituições",
    price: "R$ 199,00",
    period: "por mês",
    annualPrice: "R$ 1.999,00/ano",
    save: "Economize 17%",
    popular: false,
    color: "bg-educare-700",
    borderColor: "border-educare-700/20",
    icon: <Shield className="h-5 w-5" />,
    studentLimit: "Até 5 crianças",
    features: [
      "Cadastrar até 05 Crianças",
      "Jornada TitiNauta com Assistente IA (Web e WhatsApp)",
      "Painel de Acompanhamento da Jornada do Desenvolvimento por criança",
      "Geração de Relatórios Básicos e Detalhados auxiliados pelos assistentes virtuais Educare+",
      "Acesso Completo ao Educare Academy, blogs",
      "Mentorias coletivas Mensais",
      "Suporte prioritário"
    ]
  }
];

interface PricingPlansProps {
  activeTab: string;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ activeTab }) => {
  // Use conditional rendering based on activeTab
  if (activeTab !== "plans") {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {pricingPlans.map((plan, index) => (
        <PricingCard key={plan.id} plan={plan} index={index} />
      ))}
    </div>
  );
};

export default PricingPlans;
