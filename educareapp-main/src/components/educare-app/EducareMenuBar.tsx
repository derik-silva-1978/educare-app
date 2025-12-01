
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Menubar, 
  MenubarContent,
  MenubarItem, 
  MenubarMenu, 
  MenubarSeparator,
  MenubarShortcut, 
  MenubarTrigger 
} from '@/components/ui/menubar';
import { 
  Home,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  User,
  HelpCircle
} from 'lucide-react';

const EducareMenuBar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for the menu bar
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Início', icon: <Home className="h-4 w-4 mr-2" />, onClick: () => navigate('/') },
    { name: 'Meu App', icon: <User className="h-4 w-4 mr-2" />, onClick: () => navigate('/educare-app/dashboard') },
    { name: 'Blog', icon: <BookOpen className="h-4 w-4 mr-2" />, onClick: () => navigate('/blog') },
    { name: 'Academia Educare+', icon: <GraduationCap className="h-4 w-4 mr-2" />, onClick: () => navigate('/educare-app/academia') },
    { name: 'Loja Educare+', icon: <ShoppingBag className="h-4 w-4 mr-2" />, onClick: () => navigate('/educare-app/loja') },
  ];

  return (
    <motion.div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate('/educare-app')}
            >
              <div className="w-10 h-10 relative mr-2">
                <img 
                  src="/images/astronaut-logo.svg" 
                  alt="Educare Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/100/91D8F7/ffffff?text=E%2B";
                  }}
                />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent">
                Educare
              </span>
            </motion.div>
            
            <div className="hidden md:flex ml-8">
              <Menubar className="border-none bg-transparent">
                {menuItems.map((item) => (
                  <MenubarMenu key={item.name}>
                    <MenubarTrigger 
                      className="cursor-pointer text-sm font-medium hover:text-blue-500 transition-colors"
                      onClick={item.onClick}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {item.name}
                      </span>
                    </MenubarTrigger>
                  </MenubarMenu>
                ))}
              </Menubar>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center text-gray-600 hover:text-blue-500"
              onClick={() => navigate('/educare-app/support')}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>Suporte</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex items-center text-gray-600 hover:text-blue-500"
              onClick={() => navigate('/educare-app/auth')}
            >
              <User className="h-4 w-4 mr-1" />
              <span>Entrar</span>
            </Button>
            
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              onClick={() => navigate('/educare-app/auth?action=register')}
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EducareMenuBar;
