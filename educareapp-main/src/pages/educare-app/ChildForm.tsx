
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Form } from '@/components/ui/form';
import { useChildForm } from '@/hooks/educare-app/useChildForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import ChildBasicInfoSection from '@/components/educare-app/ChildBasicInfoSection';
import ChildAdditionalInfoSection from '@/components/educare-app/ChildAdditionalInfoSection';
import ChildFormActions from '@/components/educare-app/ChildFormActions';
import { useNavigate, useParams } from 'react-router-dom';

const ChildForm: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { form, isLoading, isEditMode, onSubmit, onDelete, isDirty, error } = useChildForm(childId);

  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da criança...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Editar' : 'Adicionar'} Criança | Educare</title>
        <meta 
          name="description" 
          content={`${isEditMode ? 'Editar' : 'Adicionar'} informações da criança no Educare`} 
        />
      </Helmet>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/educare-app/children')}
            className="gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Criança' : 'Adicionar Nova Criança'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEditMode 
                ? 'Atualize as informações da criança conforme necessário'
                : 'Preencha as informações para adicionar uma nova criança ao seu perfil'
              }
            </p>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDirty && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert>
                <AlertDescription>
                  Há alterações não salvas. Lembre-se de salvar antes de sair.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl text-gray-900">
              {isEditMode ? 'Informações da Criança' : 'Nova Criança'}
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo cuidadosamente para garantir um acompanhamento adequado.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ChildBasicInfoSection form={form} isLoading={isLoading} />
                
                <Separator className="my-8" />
                
                <ChildAdditionalInfoSection form={form} isLoading={isLoading} />
                
                <ChildFormActions
                  isEditMode={isEditMode}
                  isLoading={isLoading}
                  onDelete={onDelete}
                  isDirty={isDirty}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ChildForm;
