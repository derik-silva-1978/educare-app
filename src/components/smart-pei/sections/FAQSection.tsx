
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, School, Users, KeyRound, FileText } from 'lucide-react';

export const FAQSection: React.FC = () => {
  return (
    <div className="faq-section py-6">
      <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Uso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="general-1">
                <AccordionTrigger>O que é o Smart PEI?</AccordionTrigger>
                <AccordionContent>
                  O Smart PEI é uma plataforma completa para criação e gerenciamento de Planos de Ensino Individualizado, 
                  voltada para alunos com necessidades educacionais especiais. A plataforma facilita a colaboração entre 
                  educadores, especialistas, coordenadores e pais.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="general-2">
                <AccordionTrigger>Quem pode usar o Smart PEI?</AccordionTrigger>
                <AccordionContent>
                  O Smart PEI pode ser usado por escolas, clínicas, profissionais e famílias que precisam desenvolver 
                  e acompanhar planos de ensino individualizado para crianças com necessidades especiais.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="general-3">
                <AccordionTrigger>Quais são os requisitos técnicos?</AccordionTrigger>
                <AccordionContent>
                  Para usar o Smart PEI, você precisa apenas de um navegador web atualizado (Chrome, Firefox, Safari ou Edge) 
                  e uma conexão à internet. Não é necessário instalar nenhum software adicional.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <KeyRound className="mr-2 h-5 w-5" />
              Licenças
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="license-1">
                <AccordionTrigger>Qual licença devo escolher?</AccordionTrigger>
                <AccordionContent>
                  Se você é um pai ou responsável por uma única criança, a licença individual é mais adequada. 
                  Se você representa uma escola, clínica ou outra instituição com múltiplos alunos, a licença 
                  empresarial oferece melhor custo-benefício.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="license-2">
                <AccordionTrigger>Como funcionam as equipes?</AccordionTrigger>
                <AccordionContent>
                  Cada licença permite criar uma equipe composta por um coordenador, um responsável (pai ou mãe), 
                  e até três profissionais. O coordenador gerencia a equipe, os profissionais contribuem com o PEI, 
                  e o responsável acompanha o progresso.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="license-3">
                <AccordionTrigger>Posso trocar membros da equipe?</AccordionTrigger>
                <AccordionContent>
                  Sim, o coordenador ou administrador do sistema pode alterar a composição da equipe conforme necessário, 
                  adicionando ou removendo profissionais ou alterando o responsável caso necessário.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Usuários e Papéis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="roles-1">
                <AccordionTrigger>Quais são os diferentes papéis de usuário?</AccordionTrigger>
                <AccordionContent>
                  O Smart PEI possui vários papéis de usuário: Administrador, Coordenador, Professor, 
                  Especialista, Psicólogo, Terapeuta e Responsável. Cada papel tem permissões específicas 
                  dentro do sistema.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="roles-2">
                <AccordionTrigger>Como alterar meu papel no sistema?</AccordionTrigger>
                <AccordionContent>
                  O papel de usuário só pode ser alterado por um administrador do sistema. 
                  Entre em contato com o administrador da sua instituição para solicitar qualquer alteração de papel.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="roles-3">
                <AccordionTrigger>O que um coordenador pode fazer?</AccordionTrigger>
                <AccordionContent>
                  O coordenador gerencia equipes, convida profissionais e responsáveis, 
                  supervisiona a criação dos PEIs, e tem acesso a relatórios e análises 
                  dos alunos sob sua responsabilidade.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              PEIs e Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="reports-1">
                <AccordionTrigger>Como criar um novo PEI?</AccordionTrigger>
                <AccordionContent>
                  Para criar um novo PEI, vá para a página do aluno e clique no botão "Novo PEI". 
                  Você será guiado por um assistente que solicitará informações sobre o aluno, 
                  objetivos educacionais, estratégias e recursos necessários.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="reports-2">
                <AccordionTrigger>Quem pode editar um PEI?</AccordionTrigger>
                <AccordionContent>
                  O coordenador e os profissionais da equipe (professores, especialistas, etc.) 
                  podem editar o PEI. Os responsáveis (pais/mães) têm acesso de visualização, 
                  mas não podem fazer edições diretamente.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="reports-3">
                <AccordionTrigger>Como gerar relatórios de progresso?</AccordionTrigger>
                <AccordionContent>
                  Na página do aluno, clique na aba "Relatórios" e selecione o tipo de relatório 
                  que deseja gerar. Você pode filtrar por período, área de desenvolvimento ou 
                  outros critérios específicos antes de gerar o relatório final.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQSection;
