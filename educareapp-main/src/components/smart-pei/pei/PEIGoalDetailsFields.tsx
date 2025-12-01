
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface PEIGoalDetailsFieldsProps {
  form: UseFormReturn<z.infer<any>>;
}

export const PEIGoalDetailsFields: React.FC<PEIGoalDetailsFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título do Objetivo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Desenvolver habilidade de comunicação verbal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Detalhada</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o objetivo detalhadamente, incluindo critérios de sucesso" 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>
              Descreva o objetivo de forma clara, específica e mensurável
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="evaluationMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Método de Avaliação</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Como o progresso deste objetivo será avaliado?" 
                {...field} 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>
              Descreva como o progresso será monitorado e medido
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PEIGoalDetailsFields;
