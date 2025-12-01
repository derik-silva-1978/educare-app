
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-medium">Dashboard</h1>
        
        <div className="md:hidden">
          <Button variant="ghost" size="sm" className="ml-auto" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Voltar para o site</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
