
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInYears } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BasicInformation } from './child-form/BasicInformation';
import { GenderAndBloodType } from './child-form/GenderAndBloodType';
import { childFormSchema, ChildFormValues } from '@/schema/educare-app/childFormSchema';
import { Loader2, Save, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewChildFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  error?: string | null;
}

const NewChildForm: React.FC<NewChildFormProps> = ({ 
  onSubmit, 
  isLoading, 
  onCancel, 
  error 
}) => {
  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      birthDate: new Date().toISOString().split('T')[0],
      gender: 'male',
      observations: '',
      bloodtype: undefined,
      nationality: '',
      city: '',
      cpf: ''
    },
    mode: 'onChange' // Enable validation on change for better user feedback
  });

  const handleSubmit = (values: ChildFormValues) => {
    // Calculate age before submitting
    const age = differenceInYears(new Date(), new Date(values.birthDate));
    
    // Log submission attempt for debugging
    console.log('Form submission attempt:', { ...values, age });
    
    onSubmit({
      ...values,
      age
    });
  };

  return (
    <Card className="mb-6 border-primary/20 shadow-md">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-blue-800">Adicionar nova criança</CardTitle>
        <CardDescription className="text-blue-700">
          Preencha as informações abaixo para registrar uma nova criança no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicInformation form={form} isLoading={isLoading} />
            <GenderAndBloodType form={form} isLoading={isLoading} />
            
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informações adicionais sobre a criança"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-end space-x-3 px-0 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="gap-2 border-gray-300"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading || !form.formState.isValid}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 min-w-[140px] py-6"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Adicionar Criança
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewChildForm;
