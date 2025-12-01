
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ChildFormValues } from '@/schema/educare-app/childFormSchema';

interface Props {
  form: UseFormReturn<ChildFormValues>;
  isLoading: boolean;
}

const ChildAdditionalInfoSection: React.FC<Props> = ({ form, isLoading }) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="bloodtype"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo Sanguíneo (opcional)</FormLabel>
            <FormDescription>
              Selecione o tipo sanguíneo da criança, se conhecido
            </FormDescription>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger variant="modern">
                  <SelectValue placeholder="Selecione o tipo sanguíneo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent variant="modern">
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type} variant="modern">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormDescription>
              Adicione informações relevantes sobre a criança, como condições especiais, 
              alergias ou outras observações importantes.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Digite aqui observações importantes sobre a criança..."
                className="resize-none min-h-[120px] bg-white/90 backdrop-blur-sm border-gray-200/60 hover:border-blue-300/60 focus:border-blue-500 transition-all duration-300"
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ChildAdditionalInfoSection;
