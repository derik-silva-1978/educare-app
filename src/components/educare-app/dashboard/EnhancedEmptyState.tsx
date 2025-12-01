import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Sparkles, BookOpen, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Main Empty State */}
      <Card className="border-dashed border-2 border-gray-300 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-yellow-700" />
              </div>
            </div>
            
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Bem-vindo ao Educare+!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comece sua jornada adicionando informações sobre sua criança. 
                Nossa plataforma inteligente irá te guiar no acompanhamento do desenvolvimento infantil.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/educare-app/child/new')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeira Criança
              </Button>
            </>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Primeiros Passos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-medium mb-1">Explore o Blog</h4>
              <p className="text-sm text-gray-600 mb-3">
                Leia artigos especializados sobre desenvolvimento infantil
              </p>
              <Button size="sm" variant="outline" onClick={() => navigate('/blog')}>
                Ir para o Blog
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="font-medium mb-1">Conheça o Journey Bot</h4>
              <p className="text-sm text-gray-600 mb-3">
                Nossa IA para avaliação do desenvolvimento infantil
              </p>
              <Button size="sm" variant="outline" onClick={() => navigate('/educare-app/journey-bot')}>
                Conhecer Journey Bot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedEmptyState;