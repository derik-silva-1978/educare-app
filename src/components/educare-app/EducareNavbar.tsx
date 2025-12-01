
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

const EducareNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for the navbar
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
    { name: 'Início', icon: <Home className="h-4 w-4 mr-2" />, onClick: () => navigate('/educare-app') },
    { name: 'Jornada do Desenvolvimento', icon: <User className="h-4 w-4 mr-2" />, onClick: () => navigate('/educare-app/dashboard') },
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
              <div className="w-10 h-10 relative mr-2 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold bg-gradient-to-r from-sky-500 to-purple-400 bg-clip-text text-transparent">
                  Educare+ Tech
                </span>
                <span className="text-xs text-gray-500 -mt-1">Plataforma Educacional</span>
              </div>
            </motion.div>
            
            <div className="hidden md:flex ml-8">
              <Menubar className="border-none bg-transparent">
                {menuItems.map((item) => (
                  <MenubarMenu key={item.name}>
                    <MenubarTrigger 
                      className="cursor-pointer text-sm font-medium hover:text-sky-500 transition-colors"
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
              className="hidden sm:flex items-center text-gray-600 hover:text-sky-500"
              onClick={() => navigate('/educare-app/suporte')}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>Suporte</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex items-center text-gray-600 hover:text-sky-500"
              onClick={() => navigate('/educare-app/auth')}
            >
              <User className="h-4 w-4 mr-1" />
              <span>Entrar</span>
            </Button>
            
            <Button 
              size="sm"
              className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white"
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

export default EducareNavbar;
