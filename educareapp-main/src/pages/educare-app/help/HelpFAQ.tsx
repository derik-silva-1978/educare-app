
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const HelpFAQ: React.FC = () => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="w-full mb-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>Como cadastrar uma criança?</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse a seção "Minhas Crianças" no menu principal.</li>
              <li>Clique no botão "Adicionar Criança".</li>
              <li>Preencha os dados e salve.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Como realizar uma avaliação?</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Vá até "Avaliações", clique em "Nova Avaliação".</li>
              <li>Selecione a criança, responda às perguntas, finalize.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Como convidar profissionais?</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>No perfil da criança vá até a aba "Profissionais".</li>
              <li>Clique em "Convidar Profissional", preencha os dados.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Como configurar notificações?</AccordionTrigger>
          <AccordionContent>
            <p>No menu "Configurações", personalize suas preferências de notificação.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
