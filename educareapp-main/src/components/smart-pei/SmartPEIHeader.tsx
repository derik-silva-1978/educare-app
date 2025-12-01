
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

interface SmartPEIHeaderProps {
  isAuthenticated: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  handleLogout: () => void;
  notificationsDropdown?: React.ReactNode;
}

export const SmartPEIHeader = ({ 
  isAuthenticated, 
  showUserDropdown, 
  setShowUserDropdown, 
  handleLogout,
  notificationsDropdown
}: SmartPEIHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-sky-600">
              Smart PEI
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {notificationsDropdown}
              <div className="relative">
                <div 
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                    <span className="text-sm font-medium">U</span>
                  </div>
                  <span className="hidden md:block text-sm">Olá, <span className="font-medium">Usuário</span></span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</Link>
                    <Link to="/smart-pei/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notificações</Link>
                    <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ajuda</Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/auth?action=login"
                className="text-sm font-medium text-gray-700 hover:text-sky-600"
              >
                Login
              </Link>
              <Link 
                to="/auth?action=register"
                className="text-sm font-medium bg-sky-600 text-white px-3 py-1.5 rounded-md hover:bg-sky-700"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
