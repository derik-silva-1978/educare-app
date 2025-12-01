
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToActionPanel = () => {
  return (
    <div className="glass-panel rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Explore Todos os Recursos</h3>
        <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
          Crie sua conta agora para acessar todas as funcionalidades do Sistema Educare+ e 
          transformar sua experiência educacional.
        </p>
        <Button asChild className="bg-educare-600 hover:bg-educare-700">
          <Link to="/auth?action=register">Começar Agora</Link>
        </Button>
      </div>
    </div>
  );
};

export default CallToActionPanel;
