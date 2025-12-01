
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './navbar/BrandLogo';
import AuthButtons from './navbar/AuthButtons';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string): boolean => {
    if (!path) return false;
    
    if (path === '/educare-app') {
      return location.pathname === '/educare-app' || location.pathname === '/';
    }
    
    // Handle hash links
    if (path.includes('#')) {
      // For hash links, check if the current URL contains the hash
      return location.hash === `#${path.split('#')[1]}`;
    }
    
    // For regular paths
    return location.pathname.startsWith(path);
  };

  // Updated navigation structure - all pointing to official landing
  const navLinks = [
    { label: 'Início', href: '/educare-app' },
    { label: 'Meu App', href: '/educare-app/dashboard' },
    { label: 'Blog', href: '/blog' },
    { label: 'Academia Educare+', href: '/educare-app/academia' },
    { label: 'Loja Educare+', href: '/educare-app/loja' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-background/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo - updated to link to official landing */}
          <Link to="/educare-app" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">E+</span>
            </div>
            <motion.span 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Educare
            </motion.span>
          </Link>

          {/* Desktop Navigation Links - styled to match reference */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href) 
                    ? 'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20' 
                    : 'text-foreground hover:bg-accent hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <AuthButtons />

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-foreground focus:outline-none rounded-md hover:bg-accent transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-1 border-t bg-background shadow-lg">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Link
                    to={link.href}
                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary font-medium dark:bg-primary/20'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Auth links for mobile */}
              <div className="pt-2 border-t border-gray-100">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Link
                    to="/educare-app/auth?action=login"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Entrar
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Link
                    to="/educare-app/auth?action=register"
                    className="block px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md mt-2"
                  >
                    Cadastrar
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
