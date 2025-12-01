
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart, Calendar, Baby, AlertTriangle, Info } from 'lucide-react';

const EduCareMaternalHealthPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Saúde Materna | Educare</title>
        <meta name="description" content="Informações e recursos sobre saúde materna" />
      </Helmet>
      
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Saúde Materna</h1>
          <p className="text-muted-foreground">
            Recursos e informações para acompanhamento da saúde materna e desenvolvimento infantil
          </p>
        </header>
        
        <Tabs defaultValue="pregnancy">
          <TabsList className="mb-6">
            <TabsTrigger value="pregnancy" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Gravidez</span>
            </TabsTrigger>
            <TabsTrigger value="postpartum" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Pós-parto</span>
            </TabsTrigger>
            <TabsTrigger value="early-childhood" className="flex items-center gap-1">
              <Baby className="h-4 w-4" />
              <span>Primeira Infância</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pregnancy">
            <div className="space-y-6">
              <Alert>
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  As informações fornecidas são apenas para fins educacionais e não substituem o aconselhamento médico profissional.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Desenvolvimento Fetal</CardTitle>
                    <CardDescription>
                      Acompanhe o desenvolvimento do bebê semana a semana
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      O desenvolvimento fetal é dividido em trimestres, cada um marcado por marcos importantes
                      no desenvolvimento do bebê.
                    </p>
                    <Button className="w-full">Ver Guia de Desenvolvimento</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cuidados Pré-natais</CardTitle>
                    <CardDescription>
                      Dicas e orientações para uma gestação saudável
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Manter consultas regulares com seu médico, seguir uma dieta equilibrada e praticar 
                      exercícios adequados são essenciais para uma gravidez saudável.
                    </p>
                    <Button className="w-full">Ver Recomendações</Button>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Calendário de Consultas</CardTitle>
                    <CardDescription>
                      Acompanhe e agende suas consultas pré-natais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-4 text-center">
                      <p className="text-muted-foreground">
                        O calendário de consultas estará disponível em breve.
                      </p>
                      <Button variant="outline" className="mt-4">Ser Notificado</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="postpartum">
            <div className="space-y-6">
              <Alert>
                <Info className="h-5 w-5" />
                <AlertTitle>Suporte Pós-parto</AlertTitle>
                <AlertDescription>
                  O período pós-parto traz muitas mudanças e desafios. Buscar apoio é fundamental para a saúde da mãe e do bebê.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Saúde Física</CardTitle>
                    <CardDescription>
                      Cuidados com o corpo após o parto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Recuperação pós-parto, aleitamento materno, rotina de sono e outros aspectos importantes
                      para a saúde física da mãe.
                    </p>
                    <Button className="w-full">Saiba Mais</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Saúde Mental</CardTitle>
                    <CardDescription>
                      Apoio emocional e psicológico para novas mães
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Entenda sobre baby blues, depressão pós-parto, ansiedade e como buscar apoio
                      quando necessário.
                    </p>
                    <Button className="w-full">Recursos de Apoio</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cuidados com o Recém-nascido</CardTitle>
                    <CardDescription>
                      Orientações para os primeiros dias com o bebê
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Dicas sobre amamentação, banho, sono, troca de fraldas e identificação
                      de sinais de alerta no bebê.
                    </p>
                    <Button className="w-full">Ver Guia</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Grupos de Apoio</CardTitle>
                    <CardDescription>
                      Conecte-se com outras mães e profissionais
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Participar de grupos de apoio pode ajudar a compartilhar experiências
                      e tirar dúvidas comuns do período pós-parto.
                    </p>
                    <Button className="w-full">Encontrar Grupos</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="early-childhood">
            <div className="space-y-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Desenvolvimento na Primeira Infância</CardTitle>
                  <CardDescription>
                    Entenda os principais marcos do desenvolvimento infantil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      A primeira infância, que compreende os primeiros anos de vida, é um período crucial para o desenvolvimento
                      cerebral e formação das bases para toda a vida.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">0-12 meses</h3>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          <li>Sorri socialmente</li>
                          <li>Sustenta a cabeça</li>
                          <li>Rola</li>
                          <li>Senta sem apoio</li>
                          <li>Engatinha</li>
                          <li>Primeiras palavras</li>
                        </ul>
                        <Button variant="link" className="p-0 h-auto mt-2 text-sm">Ver mais</Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">1-2 anos</h3>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          <li>Primeiros passos</li>
                          <li>Vocabulário expandido</li>
                          <li>Segurar copo</li>
                          <li>Uso de colher</li>
                          <li>Frases simples</li>
                          <li>Empilhar blocos</li>
                        </ul>
                        <Button variant="link" className="p-0 h-auto mt-2 text-sm">Ver mais</Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">3-5 anos</h3>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          <li>Frases completas</li>
                          <li>Pular e pular em um pé</li>
                          <li>Desenhar formas</li>
                          <li>Seguir regras simples</li>
                          <li>Jogos interativos</li>
                          <li>Consciência de letras</li>
                        </ul>
                        <Button variant="link" className="p-0 h-auto mt-2 text-sm">Ver mais</Button>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4">Guia de Desenvolvimento Completo</Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estimulação Precoce</CardTitle>
                    <CardDescription>
                      Atividades para estimular o desenvolvimento infantil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Atividades adequadas para cada faixa etária que estimulam o desenvolvimento
                      cognitivo, motor, linguístico e social da criança.
                    </p>
                    <Button className="w-full">Ver Atividades</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrição Infantil</CardTitle>
                    <CardDescription>
                      Orientações para uma alimentação saudável
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Do aleitamento materno à introdução alimentar, saiba como oferecer
                      uma nutrição adequada para o desenvolvimento saudável da criança.
                    </p>
                    <Button className="w-full">Guia de Nutrição</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default EduCareMaternalHealthPage;
