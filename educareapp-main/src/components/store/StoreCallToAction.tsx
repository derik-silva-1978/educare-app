
import React from 'react';
import { Tags, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StoreCallToAction: React.FC = () => {
  return (
    <div className="mt-16 bg-secondary/20 rounded-2xl p-8 text-center">
      <div className="inline-block p-3 rounded-full bg-secondary/30 mb-4">
        <Tags className="h-8 w-8 text-secondary-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Benefícios Exclusivos</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
        Clientes Educare+ têm acesso a descontos especiais, suporte prioritário e treinamentos exclusivos.
      </p>
      <Button asChild size="lg" className="rounded-full">
        <Link to="/auth?action=register">
          Criar conta
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};

export default StoreCallToAction;
