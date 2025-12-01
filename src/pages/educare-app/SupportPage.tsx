import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DevPlaceholder } from '@/components/ui/dev-badge';
import { HelpCircle, ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SupportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Suporte | Educare</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Suporte Educare+</h1>
            <p className="text-muted-foreground">
              Estamos aqui para ajudar você na jornada do desenvolvimento infantil
            </p>
          </div>

          <DevPlaceholder 
            title="Central de Suporte em Desenvolvimento"
            description="Em breve você terá acesso a FAQs, tutoriais, chat ao vivo e suporte por ticket para resolver suas dúvidas."
            icon={HelpCircle}
          />

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Contato por Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Envie suas dúvidas diretamente para nossa equipe.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'mailto:suporte@educareapp.com'}
                >
                  suporte@educareapp.com
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Fale conosco pelo WhatsApp para suporte rápido.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://wa.me/5598991801628', '_blank')}
                >
                  Iniciar Conversa
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={() => navigate('/educare-app/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Ir para Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/contact')}
            >
              Formulário de Contato
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
