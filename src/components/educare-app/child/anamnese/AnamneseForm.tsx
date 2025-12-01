
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAnamnese } from '@/hooks/useAnamnese';
import {
  AnamneseData,
  AnamneseFormData
} from '@/types/anamneseTypes';
import { PregnancySection } from './sections/PregnancySection';
import { BirthSection } from './sections/BirthSection';

// Simple schema that matches the database exactly (all strings)
const anamneseSchema = z.object({
  prenatal_start: z.string().optional(),
  blood_exams: z.string().optional(),
  immunization: z.string().optional(),
  birth_location: z.string().optional(),
  birth_type: z.string().optional(),
});

type FormData = z.infer<typeof anamneseSchema>;

interface AnamneseFormProps {
  childId: string;
  existingData?: AnamneseData;
  onSubmit?: (data: AnamneseFormData) => void;
  onCancel?: () => void;
}

export const AnamneseForm: React.FC<AnamneseFormProps> = ({
  childId,
  existingData,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const { createAnamnese, updateAnamnese, isLoading } = useAnamnese(childId);

  const form = useForm<FormData>({
    resolver: zodResolver(anamneseSchema),
    defaultValues: {
      prenatal_start: '',
      blood_exams: '',
      immunization: '',
      birth_location: '',
      birth_type: '',
    }
  });

  // Set form values when existing data is provided
  useEffect(() => {
    if (existingData) {
      const formData: FormData = {
        prenatal_start: existingData.prenatal_start || '',
        blood_exams: existingData.blood_exams || '',
        immunization: existingData.immunization || '',
        birth_location: existingData.birth_location || '',
        birth_type: existingData.birth_type || '',
      };
      form.reset(formData);
    }
  }, [existingData, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      const submitData: AnamneseFormData = {
        prenatal_start: data.prenatal_start,
        blood_exams: data.blood_exams,
        immunization: data.immunization,
        birth_location: data.birth_location,
        birth_type: data.birth_type,
      };

      if (existingData?.id) {
        updateAnamnese({ id: existingData.id, data: submitData });
      } else {
        createAnamnese(submitData);
      }

      if (onSubmit) {
        onSubmit(submitData);
      }
    } catch (error) {
      console.error('Error saving anamnese:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Anamnese da Criança
        </h1>
        <p className="text-gray-600 mt-2">
          Preencha as informações sobre o histórico da criança
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <PregnancySection control={form.control} />
          <BirthSection control={form.control} />

          <div className="flex justify-end space-x-4 pt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Anamnese'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnamneseForm;
