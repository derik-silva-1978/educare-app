
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TitibotUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const TitibotUpgradeDialog: React.FC<TitibotUpgradeDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}) => {
  const features = [
    "Respostas mais detalhadas e precisas",
    "Prioridade no processamento de consultas",
    "Sugestões personalizadas avançadas",
    "Histórico de consultas expandido",
    "Acesso a recursos exclusivos"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <div className="w-full flex justify-center mb-2">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-yellow-300 w-16 h-16 rounded-full 
                        flex items-center justify-center shadow-lg"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          <DialogTitle className="text-center text-xl">
            Ativar Titibot Turbo
          </DialogTitle>
          <DialogDescription className="text-center">
            Melhore sua experiência com recursos premium do assistente inteligente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h4 className="font-medium text-amber-900 flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Recursos Premium
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-2 text-sm text-amber-800"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Check className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Agora Não
          </Button>
          <Button 
            onClick={onConfirm} 
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-yellow-500 border-0 hover:from-amber-500 hover:to-yellow-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Ativar Turbo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TitibotUpgradeDialog;
