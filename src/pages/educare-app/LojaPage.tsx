import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DevPlaceholder } from '@/components/ui/dev-badge';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const LojaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Loja Educare+ | Educare</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6">
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
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Loja Educare+</h1>
            <p className="text-muted-foreground">
              Recursos educacionais e materiais especializados
            </p>
          </div>

          <DevPlaceholder 
            title="Loja em Desenvolvimento"
            description="Em breve você encontrará aqui recursos educacionais, materiais didáticos e ferramentas especializadas para apoiar o desenvolvimento infantil."
            icon={ShoppingBag}
          />

          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={() => navigate('/educare-app/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Ir para Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/contact')}
            >
              Entre em Contato
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LojaPage;
