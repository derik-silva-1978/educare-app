
export interface WhatsAppBotConfig {
  phoneNumber: string;
  defaultMessage: string;
  productMessages: {
    [key: string]: string;
  };
  utmTracking: boolean;
  analyticsEnabled: boolean;
}

export interface WhatsAppBotFlow {
  trigger: string;
  message: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export const whatsappBotConfig: WhatsAppBotConfig = {
  phoneNumber: "559192018206",
  defaultMessage: "Olá! 👋 Gostaria de conhecer o Educare+ Tech. Pode me ajudar?",
  productMessages: {
    'jornada': "Olá! 👋 Tenho interesse na Jornada do Desenvolvimento Infantil. Gostaria de saber mais!",
    'academia': "Olá! 👋 Quero conhecer os cursos da Academia Educare+. Pode me ajudar?",
    'loja': "Olá! 👋 Gostaria de ver os produtos da Loja Educare+. Tem algum material disponível?",
    'suporte': "Olá! 👋 Preciso de suporte técnico com a plataforma. Podem me ajudar?",
    'demo': "Olá! 👋 Gostaria de agendar uma demonstração do Educare+ Tech!",
    'landing': "Olá! 👋 Vim da página inicial e gostaria de saber mais sobre o Educare+ Tech!"
  },
  utmTracking: true,
  analyticsEnabled: true
};

export const whatsappBotFlows: Record<string, WhatsAppBotFlow> = {
  jornada: {
    trigger: "/start_jornada",
    message: whatsappBotConfig.productMessages.jornada,
    utmSource: "educare_app",
    utmMedium: "whatsapp_bot", 
    utmCampaign: "jornada_desenvolvimento"
  },
  academia: {
    trigger: "/start_academia",
    message: whatsappBotConfig.productMessages.academia,
    utmSource: "educare_app",
    utmMedium: "whatsapp_bot",
    utmCampaign: "academia_cursos"
  },
  loja: {
    trigger: "/start_loja", 
    message: whatsappBotConfig.productMessages.loja,
    utmSource: "educare_app",
    utmMedium: "whatsapp_bot",
    utmCampaign: "loja_produtos"
  },
  suporte: {
    trigger: "/start_suporte",
    message: whatsappBotConfig.productMessages.suporte,
    utmSource: "educare_app", 
    utmMedium: "whatsapp_bot",
    utmCampaign: "suporte_tecnico"
  },
  demo: {
    trigger: "/start_demo",
    message: whatsappBotConfig.productMessages.demo,
    utmSource: "educare_app",
    utmMedium: "whatsapp_bot", 
    utmCampaign: "demo_solicitacao"
  },
  landing: {
    trigger: "/start_landing",
    message: whatsappBotConfig.productMessages.landing,
    utmSource: "educare_app",
    utmMedium: "whatsapp_bot",
    utmCampaign: "landing_interesse"
  }
};

export default whatsappBotConfig;
