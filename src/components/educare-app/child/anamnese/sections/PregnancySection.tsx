
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PregnancySectionProps {
  control: Control<any>;
}

export const PregnancySection: React.FC<PregnancySectionProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Período Pré-natal</h3>
      
      <FormField
        control={control}
        name="prenatal_start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Início do pré-natal</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 2º mês de gestação" />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="blood_exams"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exames de sangue</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Realizou exames de sangue?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="immunization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imunização</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Imunização completa durante a gestação?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};
