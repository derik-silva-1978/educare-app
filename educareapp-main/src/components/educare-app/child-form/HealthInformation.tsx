
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface HealthInformationProps {
  form: UseFormReturn<any>;
  isLoading?: boolean;
}

export const HealthInformation: React.FC<HealthInformationProps> = ({ 
  form, 
  isLoading 
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alergias (opcional)</FormLabel>
            <FormDescription>
              Liste qualquer alergia conhecida, incluindo alimentos, medicamentos ou substâncias.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Liste as alergias conhecidas"
                {...field}
                disabled={isLoading}
                className="min-h-[80px] resize-vertical"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicalConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condições médicas (opcional)</FormLabel>
            <FormDescription>
              Informe condições médicas relevantes que possam influenciar no desenvolvimento.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Descreva condições médicas relevantes"
                {...field}
                disabled={isLoading}
                className="min-h-[80px] resize-vertical"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações gerais (opcional)</FormLabel>
            <FormDescription>
              Inclua qualquer informação adicional importante sobre a criança.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Adicione observações relevantes sobre a criança"
                {...field}
                disabled={isLoading}
                className="min-h-[100px] resize-vertical"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
