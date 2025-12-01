import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { AnimatedBotAvatar } from './AnimatedBotAvatar';
import { Baby, Calendar, Users } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  birthdate?: string;
  gender?: string;
}

interface JourneyBotChildSelectorProps {
  children: Child[];
  onChildSelect: (childId: string) => void;
}

const JourneyBotChildSelector: React.FC<JourneyBotChildSelectorProps> = ({
  children,
  onChildSelect
}) => {
  const getAgeText = (age: number) => {
    if (age === 0) return 'Menos de 1 ano';
    if (age === 1) return '1 ano';
    return `${age} anos`;
  };

  const getGenderIcon = (gender?: string) => {
    if (gender === 'male') return '👦';
    if (gender === 'female') return '👧';
    return '👶';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AnimatedBotAvatar mood="happy" size="xl" />
            </div>
            <CardTitle className="text-2xl text-blue-800">
              Olá! Eu sou o TitiBOT! 👋
            </CardTitle>
            <p className="text-blue-700">
              Vou te ajudar a acompanhar o desenvolvimento das suas crianças. 
              Selecione uma criança para começarmos a jornada!
            </p>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* Child Avatar */}
                  <div className="text-6xl mb-2">
                    {getGenderIcon(child.gender)}
                  </div>
                  
                  {/* Child Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {child.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                        <Calendar className="h-3 w-3" />
                        {getAgeText(child.age)}
                      </Badge>
                      
                      {child.birthdate && (
                        <p className="text-sm text-gray-600">
                          Nascido em {new Date(child.birthdate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Select Button */}
                  <Button
                    onClick={() => onChildSelect(child.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    size="lg"
                  >
                    <Baby className="h-4 w-4 mr-2" />
                    Iniciar Jornada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {children.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center border-2 border-dashed border-gray-300">
            <CardContent className="p-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma criança encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Você precisa adicionar pelo menos uma criança para usar o TitiBOT.
              </p>
              <Button variant="outline">
                Adicionar Criança
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default JourneyBotChildSelector;
