import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Star, Users, Bot, MessageCircle, Award } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  { id: "what-is-educare", question: "O que é a Plataforma Educare+?", answer: "A Educare+ é uma plataforma que combina ciência e tecnologia para acompanhar o desenvolvimento infantil e a saúde materna. Através do TitiNauta, nosso assistente inteligente, oferecemos avaliações personalizadas, orientações baseadas em protocolos da OMS e SBP, e suporte contínuo via WhatsApp e plataforma web.", icon: Sparkles },
  { id: "what-is-titinauta", question: "Quem é o TitiNauta?", answer: "O TitiNauta é nosso assistente de IA especializado que acompanha famílias na jornada do desenvolvimento infantil e saúde materna. Ele oferece dois contextos: TitiNauta para questões sobre o bebê e TitiNauta Materna para saúde da mulher. Disponível no WhatsApp e na plataforma web.", icon: Bot },
  { id: "titinauta-whatsapp", question: "Como funciona o TitiNauta no WhatsApp?", answer: "No WhatsApp, o TitiNauta oferece uma conversa natural e inteligente. Você escolhe o contexto (bebê ou saúde materna), faz suas perguntas livremente e recebe orientações personalizadas. Ele também envia avaliações semanais, lembretes importantes e pode responder por áudio quando preferir.", icon: MessageCircle },
  { id: "scientific-base", question: "Qual é a base científica?", answer: "Todo conteúdo é baseado em diretrizes da Organização Mundial da Saúde (OMS), Sociedade Brasileira de Pediatria (SBP) e pesquisas internacionais. Nosso sistema RAG (Retrieval-Augmented Generation) garante que as respostas sejam sempre fundamentadas em evidências científicas atualizadas.", icon: Award },
  { id: "data-security", question: "Como meus dados são protegidos?", answer: "Seguimos rigorosos padrões de segurança com criptografia avançada, conformidade total com a LGPD e políticas transparentes de privacidade. Seus dados são usados exclusivamente para personalizar sua experiência e nunca são compartilhados com terceiros.", icon: Shield },
  { id: "plans-pricing", question: "Quais são os planos disponíveis?", answer: "Oferecemos um plano gratuito com acesso ao TitiNauta via WhatsApp e web, avaliações básicas e acesso ao blog. Os planos pagos (Básico, Premium e Empresarial) adicionam relatórios detalhados, mais perfis de crianças, acesso à Academia Educare+ e suporte prioritário.", icon: Star },
  { id: "professional-support", question: "Profissionais de saúde podem usar?", answer: "Sim! A Educare+ oferece ferramentas específicas para profissionais de saúde e educação, incluindo o TitiNauta Especialista com base de conhecimento profissional, painel de acompanhamento de múltiplos casos, geração de relatórios e recursos para apoio em consultas.", icon: Users }
];

const LandingFAQSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tudo o que você precisa saber sobre a Educare+ e o TitiNauta
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="multiple" className="space-y-4">
            {faqItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={item.id}
                    className="border rounded-2xl bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-left font-medium">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p className="ml-14 text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default LandingFAQSection;
