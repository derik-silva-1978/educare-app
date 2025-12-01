
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface DevelopmentSectionProps {
  control: Control<any>;
}

export const DevelopmentSection: React.FC<DevelopmentSectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Desenvolvimento</h3>
      
      <FormField
        control={control}
        name="motor_development"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desenvolvimento motor</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descreva marcos do desenvolvimento motor (ex: quando sentou, engatinhou, caminhou...)"
                rows={3}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="language_development"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desenvolvimento da linguagem</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descreva marcos da linguagem (ex: primeiras palavras, frases...)"
                rows={3}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="concerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preocupações ou observações gerais</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descreva qualquer preocupação ou observação sobre o desenvolvimento da criança"
                rows={4}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
