import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Code, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';

const DevelopmentJourneyHub: React.FC = () => {
  const navigate = useNavigate();
  const { children } = useCustomChildren();
  const [showWebDevModal, setShowWebDevModal] = useState(false);

  // Configuração do WhatsApp - Número oficial: +55 91 99201-8206
  const WHATSAPP_PHONE = "5591992018206";
  const WHATSAPP_MESSAGE = "Olá! Quero iniciar a Jornada do Desenvolvimento no Educare+ Ch@t.";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const handleWhatsAppClick = () => {
    window.open(WHATSAPP_URL, '_blank');
  };

  const handleWebAppClick = () => {
    setShowWebDevModal(true);
  };

  const handleWebAppCTA = () => {
    setShowWebDevModal(false);
    setTimeout(handleWhatsAppClick, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3">
          Jornada do Desenvolvimento
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Escolha como você quer acompanhar o desenvolvimento do seu bebê
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 - WhatsApp */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            {/* Logo Educare+ Ch@t */}
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/images/educare-chat-logo.png" 
                alt="Educare+ Ch@t" 
                className="h-24 w-auto object-contain"
              />
            </div>
            
            {/* Header com Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Educare+ Ch@t
                </h2>
              </div>
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm font-medium rounded-full">
                Disponível
              </span>
            </div>

            {/* Descrição */}
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Acompanhe o desenvolvimento do bebê direto no WhatsApp, com perguntas e dicas práticas.
            </p>

            {/* Como Funciona */}
            <div className="mb-8 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Como funciona:</h3>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-6">1.</span>
                  <span>Você toca em <strong>Abrir no WhatsApp</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-6">2.</span>
                  <span>O TitiNauta faz 3 perguntas rápidas para entender a idade/fase</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-6">3.</span>
                  <span>Você recebe dicas + atividades e pode continuar a jornada quando quiser</span>
                </li>
              </ol>
            </div>

            {/* Exemplo */}
            <div className="mb-8 border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                <strong>Exemplo:</strong> "Hoje vamos observar o contato visual. Quer tentar uma atividade de 2 minutos?"
              </p>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Abrir no WhatsApp
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Card 2 - Web App */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-300 dark:border-slate-600 overflow-hidden opacity-75">
          <div className="p-8">
            {/* Header com Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code className="h-8 w-8 text-slate-400" />
                <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                  App Web
                </h2>
              </div>
              <span className="inline-block px-3 py-1 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full">
                Em desenvolvimento
              </span>
            </div>

            {/* Descrição */}
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Estamos finalizando a versão web. Enquanto isso, use o WhatsApp.
            </p>

            {/* Spacer */}
            <div className="mb-8 h-32"></div>

            {/* CTA Button - Desabilitado */}
            <Button
              onClick={handleWebAppClick}
              disabled
              variant="outline"
              className="w-full text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 py-3 rounded-lg opacity-50 cursor-not-allowed"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Em desenvolvimento
            </Button>

            {/* Fallback Message */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              Clique para mais informações
            </p>
          </div>
        </div>
      </div>

      {/* Modal - Em Desenvolvimento */}
      <Dialog open={showWebDevModal} onOpenChange={setShowWebDevModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              Versão Web em Construção
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-base text-slate-700 dark:text-slate-300">
              Estamos trabalhando para trazer uma experiência completa no navegador. Por enquanto, a jornada está disponível no WhatsApp.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                ℹ️ <strong>Dica:</strong> O WhatsApp oferece a melhor experiência mobile e notificações em tempo real.
              </p>
            </div>
          </DialogDescription>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowWebDevModal(false)}
              variant="outline"
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              onClick={handleWebAppCTA}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Ir para WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevelopmentJourneyHub;
