
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const FinalCTASection: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme o Desenvolvimento Infantil
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de famílias, educadores e profissionais que já confiam na plataforma Educare+ 
            para apoiar o desenvolvimento de crianças em todo o Brasil.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {user ? (
              <Button size="lg" variant="secondary" className="text-purple-600" asChild>
                <Link to="/educare-app/dashboard">
                  Acessar Meu Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" variant="secondary" className="text-purple-600" asChild>
                <Link to="/educare-app/auth?action=register">
                  Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600" asChild>
              <Link to="/contact">
                Fale Conosco
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">+10.000</div>
              <div className="text-blue-100">Crianças avaliadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">+500</div>
              <div className="text-purple-100">Profissionais ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-green-100">Satisfação dos usuários</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
