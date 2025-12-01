
import React, { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2, Save, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AssessmentDomain, AssessmentLevel } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';
import { Skills } from './assessment/Skills';
import { Questions } from './assessment/Questions';
import AccessDenied from '../auth/AccessDenied';

export const ManageAssessments: React.FC = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin']);
  const [activeTab, setActiveTab] = useState('skills');

  if (!isAdmin) {
    return <AccessDenied requiredRoles={['admin']} />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Gerenciar Avaliações</h1>
        <p className="text-muted-foreground">
          Adicione, edite ou remova habilidades e perguntas de avaliação
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle>Painel de Administração de Avaliações</CardTitle>
          <CardDescription>
            Gerencie as habilidades e questões utilizadas nas avaliações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="skills">Habilidades</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-4">
              <Skills />
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4">
              <Questions />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Todas as alterações feitas aqui afetarão diretamente as avaliações disponíveis no sistema
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageAssessments;
