import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { 
  LogOut, 
  User, 
  Bell,
  Menu, 
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogoutClick = async () => {
    try {
      if (handleLogout) {
        handleLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">Smart PEI</span>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5 mr-1" />
                <span className="sr-only md:not-sr-only">Notificações</span>
              </Button>
              
              <div className="flex items-center">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline-block">{user.email}</span>
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogoutClick}>
                <LogOut className="h-4 w-4 mr-1" />
                <span>Sair</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4 space-y-2">
            {user && (
              <>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Bell className="h-5 w-5 mr-2" />
                  <span>Notificações</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <User className="h-5 w-5 mr-2" />
                  <span>{user.email}</span>
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogoutClick}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sair</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
