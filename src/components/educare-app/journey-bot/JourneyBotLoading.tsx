import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export const JourneyBotLoading: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute inset-2 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-green-600 animate-bounce" />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Preparando o TitiNauta
        </h3>
        <p className="text-gray-600 mb-6">
          Carregando conteúdo personalizado para a criança...
        </p>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </CardContent>
    </Card>
  );
};
