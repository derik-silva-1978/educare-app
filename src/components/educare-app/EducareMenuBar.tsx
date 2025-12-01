
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
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { DarkModeToggle } from '@/components/educare-app/layout/DarkModeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const EducareMenuBar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        scrolled 
          ? 'bg-background/95 backdrop-blur-lg shadow-sm border-b border-border' 
          : 'bg-transparent'
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
                      className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors"
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
            <DarkModeToggle />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => navigate('/educare-app/support')}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>Suporte</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex items-center text-muted-foreground hover:text-primary"
              onClick={() => navigate('/educare-app/auth')}
            >
              <User className="h-4 w-4 mr-1" />
              <span>Entrar</span>
            </Button>
            
            <Button 
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              onClick={() => navigate('/educare-app/auth?action=register')}
            >
              Começar Agora
            </Button>
            
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {menuItems.map((item) => (
                    <Button 
                      key={item.name}
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => {
                        item.onClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  ))}
                  <hr className="my-2" />
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => {
                      navigate('/educare-app/support');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Suporte
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => {
                      navigate('/educare-app/auth');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    onClick={() => {
                      navigate('/educare-app/auth?action=register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Começar Agora
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EducareMenuBar;
