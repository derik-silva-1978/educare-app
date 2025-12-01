
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LearningHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Back to Educare+ */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Educare+
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <Link to="/educare-app/aprendizado" className="text-xl font-bold text-blue-600">
            Aprendizado
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cursos..."
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Right section - User actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/educare-app/aprendizado/profile')}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
          
          <Button
            onClick={() => navigate('/educare-app/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Entrar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LearningHeader;
