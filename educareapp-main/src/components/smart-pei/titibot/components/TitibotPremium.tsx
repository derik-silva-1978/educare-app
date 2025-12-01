
import React from 'react';
import { Zap, ZapOff, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface TitibotPremiumProps {
  isPremium: boolean;
  upgradeToPremium: () => void;
  downgradeFromPremium: () => void;
}

export const TitibotPremium: React.FC<TitibotPremiumProps> = ({
  isPremium,
  upgradeToPremium,
  downgradeFromPremium
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-4">
        <motion.div 
          className="rounded-lg border p-4 relative overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isPremium && (
            <div className="absolute -top-1 -right-1">
              <div className="bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-bl-md transform rotate-6">
                Ativo
              </div>
            </div>
          )}
          
          <h3 className="font-medium mb-2 flex items-center gap-2">
            {isPremium ? (
              <>
                <Zap className="h-5 w-5 text-yellow-500" />
                Titibot Turbo Ativo
              </>
            ) : (
              <>
                <ZapOff className="h-5 w-5 text-muted-foreground" />
                Titibot Padrão Ativo
              </>
            )}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            {isPremium 
              ? "Você está usando a versão premium do Titibot com análises aprofundadas, respostas detalhadas e recursos avançados." 
              : "Atualize para o Titibot Turbo para acessar análises aprofundadas, respostas detalhadas e recursos avançados."}
          </p>
          
          {isPremium ? (
            <Button 
              onClick={downgradeFromPremium}
              variant="outline"
              className="w-full"
            >
              Desativar Turbo
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={upgradeToPremium}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white w-full"
              >
                <Zap className="mr-2 h-4 w-4" />
                Ativar Demo Turbo
              </Button>
              <Button 
                asChild
                variant="outline"
                className="w-full"
              >
                <Link to="/store?product=titibot-turbo">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar Turbo
                </Link>
              </Button>
            </div>
          )}
        </motion.div>
        
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Comparativo de Recursos</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <span>Respostas personalizadas</span>
              <span className="text-green-600 font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Ambos
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <span>Respostas em português</span>
              <span className="text-green-600 font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Ambos
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <span>Respostas aprofundadas</span>
              <span className="flex items-center text-yellow-600 font-medium">
                <Zap className="h-4 w-4 mr-1" />
                Turbo
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <span>Análises baseadas em evidências</span>
              <span className="flex items-center text-yellow-600 font-medium">
                <Zap className="h-4 w-4 mr-1" />
                Turbo
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <span>Sugestões personalizadas</span>
              <span className="flex items-center text-yellow-600 font-medium">
                <Zap className="h-4 w-4 mr-1" />
                Turbo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitibotPremium;
