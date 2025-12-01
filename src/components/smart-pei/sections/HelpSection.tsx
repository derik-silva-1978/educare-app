
import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, VideoIcon, Mail } from 'lucide-react';

export const HelpSection: React.FC = () => {
  return (
    <div className="help-section">
      <h2 className="text-2xl font-bold mb-6">Ajuda e Suporte</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documentação
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manual do Usuário</div>
            <p className="text-xs text-muted-foreground mt-1">
              Guias completos e instruções de uso
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              asChild
            >
              <Link to="/smart-pei/help?tab=manual">Acessar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tutoriais em Vídeo
            </CardTitle>
            <VideoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Vídeos</div>
            <p className="text-xs text-muted-foreground mt-1">
              Instruções passo-a-passo em vídeo
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              asChild
            >
              <Link to="/smart-pei/help?tab=tutorials">Assistir</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contato
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Suporte</div>
            <p className="text-xs text-muted-foreground mt-1">
              Entre em contato com nossa equipe
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              asChild
            >
              <Link to="/smart-pei/help?tab=support">Enviar Mensagem</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <h3 className="text-lg font-semibold mb-4">Perguntas Frequentes</h3>
        
        <AccordionItem value="item-1">
          <AccordionTrigger>Como criar um novo PEI?</AccordionTrigger>
          <AccordionContent>
            Para criar um novo PEI, acesse a página do aluno e clique no botão "Novo PEI". 
            Preencha as informações iniciais e siga as etapas do assistente de criação.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Como compartilhar um relatório?</AccordionTrigger>
          <AccordionContent>
            Após gerar um relatório, você pode compartilhá-lo através do botão "Compartilhar" 
            disponível na visualização do relatório. É possível compartilhar via email ou 
            gerar um link de acesso.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Como interpretar os gráficos do dashboard?</AccordionTrigger>
          <AccordionContent>
            Os gráficos do dashboard apresentam dados agregados dos alunos e seus PEIs. 
            Você pode passar o mouse sobre cada elemento do gráfico para ver informações 
            detalhadas e usar os filtros para personalizar a visualização.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>Como recuperar minha senha?</AccordionTrigger>
          <AccordionContent>
            Na tela de login, clique em "Esqueci minha senha" e siga as instruções 
            enviadas para seu email cadastrado para redefinir sua senha.
          </AccordionContent>
        </AccordionItem>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/smart-pei/help?tab=faq">
              Ver todas as perguntas frequentes
            </Link>
          </Button>
        </div>
      </Accordion>
    </div>
  );
};

export default HelpSection;
