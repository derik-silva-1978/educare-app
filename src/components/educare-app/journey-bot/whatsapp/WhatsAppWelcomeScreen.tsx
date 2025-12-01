import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Sparkles } from 'lucide-react';

interface WhatsAppWelcomeScreenProps {
  childName?: string;
  onStart: () => void;
  onBack: () => void;
}

export const WhatsAppWelcomeScreen: React.FC<WhatsAppWelcomeScreenProps> = ({
  childName = 'criança',
  onStart,
  onBack
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MessageCircle className="w-6 h-6" />
          Bem-vindo ao TitiNauta!
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-green-500 opacity-50" />
          </div>
          
          <p className="text-center text-lg text-gray-700">
            Olá! Sou o TitiNauta, seu assistente inteligente de desenvolvimento infantil.
          </p>
          
          <p className="text-center text-gray-600">
            Vou acompanhar o desenvolvimento de <strong>{childName}</strong> com conversas interativas e atividades personalizadas.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">O que você pode esperar:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Conversas sobre marcos do desenvolvimento</li>
              <li>Atividades práticas e personalizadas</li>
              <li>Dicas de estimulação e cuidados</li>
              <li>Acompanhamento do progresso</li>
            </ul>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onStart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            >
              Começar Conversa
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-6 text-lg"
            >
              Voltar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
