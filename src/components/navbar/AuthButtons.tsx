
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const AuthButtons = () => {
  return (
    <motion.div 
      className="hidden md:flex items-center space-x-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button 
        asChild 
        variant="outline" 
        className="rounded-full px-6 text-educare-navy border-educare-navy hover:bg-educare-navy hover:text-white transition-colors"
      >
        <Link to="/auth?action=login">Entrar</Link>
      </Button>
      <Button 
        asChild 
        className="rounded-full px-6 bg-educare-600 hover:bg-educare-700 text-white shadow-sm transition-colors"
      >
        <Link to="/auth?action=register">Cadastrar</Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        className="px-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        title="Portal Administrativo"
      >
        <Link to="/admin/auth">
          <Shield className="h-4 w-4 mr-2" />
          Admin
        </Link>
      </Button>
    </motion.div>
  );
};

export default AuthButtons;
