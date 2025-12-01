import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { TitiNautaAvatar } from '../TitiNautaAvatar';

interface WhatsAppWelcomeScreenProps {
  onStart: () => void;
  childName: string;
  ageRange: string;
}

export const WhatsAppWelcomeScreen: React.FC<WhatsAppWelcomeScreenProps> = ({
  onStart,
  childName,
  ageRange
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-b from-green-50 to-green-100 p-6">
      <Card className="w-full max-w-sm bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="text-center p-8">
          {/* TitiNauta Avatar */}
          <div className="relative mb-6 flex justify-center">
            <TitiNautaAvatar size="xl" mood="celebrating" />
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            TitiNauta 🤖
          </h1>
          
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Olá! Vou ajudar você a acompanhar o desenvolvimento do <strong>{childName}</strong> 
            na faixa etária de <strong>{ageRange}</strong>.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">💬</span>
              <span className="text-sm font-medium text-green-800">Como funciona</span>
            </div>
            <p className="text-xs text-green-700 leading-relaxed">
              Vamos conversar como no WhatsApp! Farei perguntas sobre o desenvolvimento 
              e darei dicas personalizadas para vocês.
            </p>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onStart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 h-auto"
          >
            <span className="flex items-center gap-2">
              🚀 Começar Nova Jornada
            </span>
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Uma conversa carinhosa sobre o {childName} 💕
          </p>
        </CardContent>
      </Card>
    </div>
  );
};