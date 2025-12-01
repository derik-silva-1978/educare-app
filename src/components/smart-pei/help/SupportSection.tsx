
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Mail, Phone, MessageSquare, HelpCircle } from 'lucide-react';

// Define the validation schema for the support form
const supportFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de email válido.",
  }),
  subject: z.string().min(5, {
    message: "Assunto deve ter pelo menos 5 caracteres.",
  }),
  message: z.string().min(10, {
    message: "Mensagem deve ter pelo menos 10 caracteres.",
  }),
});

// FAQ data
const faqItems = [
  {
    question: "Como posso mudar minha senha?",
    answer: "Para mudar sua senha, acesse seu perfil clicando no seu nome no canto superior direito, selecione 'Configurações' e depois 'Alterar Senha'. Siga as instruções para definir uma nova senha."
  },
  {
    question: "O que fazer se eu encontrar um erro no sistema?",
    answer: "Se você encontrar um erro, por favor, nos informe através do formulário de suporte na aba 'Contato'. Inclua detalhes sobre o que estava fazendo quando o erro ocorreu e, se possível, uma captura de tela."
  },
  {
    question: "Como posso adicionar um novo aluno ao sistema?",
    answer: "Para adicionar um novo aluno, acesse o menu 'Alunos', clique no botão 'Adicionar Aluno' e preencha todas as informações necessárias no formulário. Não se esqueça de confirmar clicando em 'Salvar'."
  },
  {
    question: "É possível exportar os relatórios gerados?",
    answer: "Sim, todos os relatórios podem ser exportados. Na página de relatórios, selecione o relatório desejado e clique no botão 'Exportar'. Você pode escolher entre os formatos PDF ou Excel."
  },
  {
    question: "Como faço para compartilhar um PEI com outros profissionais?",
    answer: "Para compartilhar um PEI, acesse o PEI desejado, clique no botão 'Compartilhar' e adicione os emails dos profissionais com quem deseja compartilhar. Você pode definir diferentes níveis de permissão para cada pessoa."
  },
  {
    question: "Quantas avaliações posso criar por aluno?",
    answer: "Não há limite para o número de avaliações por aluno. Recomendamos criar avaliações regulares para acompanhar o progresso ao longo do tempo."
  }
];

// Knowledge Base articles
const knowledgeBaseItems = [
  {
    title: "Guia de Primeiros Passos",
    description: "Aprenda os fundamentos do Smart PEI e como começar a usar o sistema.",
    icon: <BookOpen className="h-5 w-5" />,
    link: "/smart-pei/help/manual/getting-started"
  },
  {
    title: "Dicas para Avaliações Eficientes",
    description: "Melhores práticas para criar e conduzir avaliações que capturem dados relevantes.",
    icon: <BookOpen className="h-5 w-5" />,
    link: "/smart-pei/help/manual/assessments"
  },
  {
    title: "Interpretando Relatórios",
    description: "Como analisar e utilizar os dados gerados pelos relatórios do sistema.",
    icon: <BookOpen className="h-5 w-5" />,
    link: "/smart-pei/help/manual/reports"
  }
];

export const SupportSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof supportFormSchema>>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });

  function onSubmit(values: z.infer<typeof supportFormSchema>) {
    // In a real app, send this data to a backend
    console.log(values);
    
    // Show success message
    toast({
      title: "Mensagem enviada",
      description: "Recebemos sua mensagem e responderemos em breve.",
    });
    
    // Reset the form
    form.reset();
    setFormSubmitted(true);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Envie-nos um email para obter suporte
            </p>
            <p className="mt-2 font-medium">
              suporte@smartpei.com.br
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Telefone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ligue para nossa central de atendimento
            </p>
            <p className="mt-2 font-medium">
              +55 (21) 3333-4444
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Inicie um chat com nossa equipe de suporte
            </p>
            <Button variant="outline" className="mt-2 w-full">
              Iniciar Chat
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="contact">Entre em Contato</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-6">
          <div className="rounded-lg border">
            {faqItems.map((item, index) => (
              <div key={index} className={`p-4 ${index !== faqItems.length - 1 ? 'border-b' : ''}`}>
                <h3 className="text-lg font-medium flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  {item.question}
                </h3>
                <p className="mt-2 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground">Não encontrou o que procurava?</p>
            <Button 
              variant="link" 
              className="font-medium"
              onClick={() => setActiveTab("contact")}
            >
              Entre em contato com nosso suporte
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="knowledge" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="flex items-center text-lg">
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-sm text-foreground/80">
                  {item.description}
                </CardDescription>
                <Link to={item.link} className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                  Ler mais
                </Link>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="contact">
          {formSubmitted ? (
            <Card>
              <CardHeader>
                <CardTitle>Obrigado pelo seu contato!</CardTitle>
                <CardDescription>
                  Sua mensagem foi enviada com sucesso. Nossa equipe responderá em breve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setFormSubmitted(false)}>
                  Enviar outra mensagem
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Formulário de Contato</CardTitle>
                <CardDescription>
                  Preencha os detalhes abaixo e nossa equipe entrará em contato o mais breve possível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Assunto da sua mensagem" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva em detalhes como podemos ajudar..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
