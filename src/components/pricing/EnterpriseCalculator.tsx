
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EnterpriseCalculatorProps {
  activeTab: string;
  students: number;
  users: number;
  customPrice: number;
  handleStudentsChange: (value: number[]) => void;
  handleUsersChange: (value: number[]) => void;
  handleStudentInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EnterpriseCalculator: React.FC<EnterpriseCalculatorProps> = ({
  activeTab,
  students,
  users,
  customPrice,
  handleStudentsChange,
  handleUsersChange,
  handleStudentInput,
  handleUserInput
}) => {
  // Only render when activeTab is "calculator"
  if (activeTab !== "calculator") {
    return null;
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-educare-400/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-educare-400" />
            Calculadora de Plano Empresarial
          </CardTitle>
          <CardDescription>
            Personalize seu plano de acordo com a quantidade de alunos e usuários necessários para sua instituição
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Número de alunos</label>
                <span className="text-sm text-muted-foreground">{students} alunos</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider 
                  defaultValue={[50]} 
                  min={50} 
                  max={500} 
                  step={10}
                  value={[students]}
                  onValueChange={handleStudentsChange}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={students}
                  onChange={handleStudentInput}
                  min={50}
                  max={500}
                  className="w-20"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mínimo: 50 alunos</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Número de usuários</label>
                <span className="text-sm text-muted-foreground">{users} usuários</span>
              </div>
              <div className="flex items-center gap-4">
                <Slider 
                  defaultValue={[5]} 
                  min={5} 
                  max={100} 
                  step={1}
                  value={[users]}
                  onValueChange={handleUsersChange}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={users}
                  onChange={handleUserInput}
                  min={5}
                  max={100}
                  className="w-20"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mínimo: 5 usuários</p>
            </div>
          </div>
          
          <div className="p-6 bg-muted/30 rounded-lg">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground mb-2">Valor estimado</p>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold text-educare-500">R$ {customPrice.toFixed(2)}</span>
                <span className="text-muted-foreground ml-2 text-sm">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                ou R$ {(customPrice * 10).toFixed(2)}/ano (economize 17%)
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-2">
                <div className="bg-white/50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">Alunos</p>
                  <p className="text-xl font-bold">{students}</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">Usuários</p>
                  <p className="text-xl font-bold">{users}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">O que está incluído:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Acesso para {users} usuários</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Capacidade para {students} alunos</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Gestão administrativa dos usuários</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Dashboard institucional</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Análises agregadas de dados</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Titibot Assistente para todos os usuários</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 bg-educare-400 text-white rounded-full p-1 flex-shrink-0" />
                <span className="text-sm">Suporte prioritário</span>
              </li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full bg-educare-400 hover:bg-educare-500 text-white rounded-full">
            <Link to="/auth?action=register&plan=3">
              Solicitar proposta personalizada
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Nossa equipe entrará em contato em até 24h para finalizar sua proposta personalizada
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EnterpriseCalculator;
