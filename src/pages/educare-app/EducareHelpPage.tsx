
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpSidebarNav } from './help/HelpSidebarNav';
import { HelpOnboardingStepper } from './help/HelpOnboardingStepper';
import { HelpFAQ } from './help/HelpFAQ';
import { HelpSupportCTA } from './help/HelpSupportCTA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Mail, Phone, BookOpen, HelpCircle } from 'lucide-react';

const EducareHelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'faq' | 'guias' | 'suporte'>('inicio');

  return (
    <>
      <Helmet>
        <title>Central de Ajuda | Educare</title>
        <meta name="description" content="Central de ajuda, onboarding e suporte para o Educare App" />
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <HelpSidebarNav activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab as any)} />
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={val => setActiveTab(val as any)}>
            <TabsContent value="inicio">
              <section>
                <h1 className="text-2xl font-bold mb-2">Bem-vindo à Central de Ajuda do Educare!</h1>
                <p className="text-muted-foreground mb-5">Aqui você encontra todas as orientações para aproveitar o melhor da plataforma.</p>
                <HelpOnboardingStepper />
                <HelpSupportCTA className="my-8" />
              </section>
            </TabsContent>
            <TabsContent value="faq">
              <HelpFAQ />
            </TabsContent>
            <TabsContent value="guias">
              <section>
                <h2 className="text-xl font-semibold mb-4">Guias & Materiais Rápidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Guia de Início Rápido
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        Aprenda os primeiros passos para utilizar a plataforma Educare.
                      </CardDescription>
                      <Button variant="outline" className="w-full">Ver Guia</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Guia de Avaliações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        Entenda como funcionam as avaliações de desenvolvimento infantil.
                      </CardDescription>
                      <Button variant="outline" className="w-full">Ver Guia</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Guia para Profissionais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        Saiba como utilizar a plataforma como profissional convidado.
                      </CardDescription>
                      <Button variant="outline" className="w-full">Ver Guia</Button>
                    </CardContent>
                  </Card>
                  
                  <div>Em breve: Guias detalhados para pais e profissionais.</div>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="suporte">
              <section>
                <h2 className="text-xl font-semibold mb-4">Suporte e Contato</h2>
                <HelpSupportCTA />
              </section>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default EducareHelpPage;
