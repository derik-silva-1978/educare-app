
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WelcomePanel = () => {
  return (
    <div className="glass-panel rounded-xl p-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Olá, Bem-vindo ao Educare+</h2>
          <p className="text-muted-foreground mt-1">
            Este é um preview do seu dashboard. Acesse todas as funcionalidades criando uma conta.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-educare-600 hover:bg-educare-700">
            <Link to="/auth?action=register">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;
