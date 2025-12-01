
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ChildFormValues } from '@/schema/educare-app/childFormSchema';

interface Props {
  form: UseFormReturn<ChildFormValues>;
  isLoading: boolean;
}

const GenderAndBloodType: React.FC<Props> = ({ form, isLoading }) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-foreground font-medium">
              Gênero
              <span className="text-destructive ml-1">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-wrap gap-6"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="male" 
                    id="male" 
                    className="border-primary text-primary" 
                  />
                  <Label 
                    htmlFor="male" 
                    className="cursor-pointer hover:text-primary transition-colors"
                  >
                    Masculino
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="female" 
                    id="female" 
                    className="border-primary text-primary" 
                  />
                  <Label 
                    htmlFor="female"
                    className="cursor-pointer hover:text-primary transition-colors"
                  >
                    Feminino
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="other" 
                    id="other" 
                    className="border-primary text-primary" 
                  />
                  <Label 
                    htmlFor="other"
                    className="cursor-pointer hover:text-primary transition-colors"
                  >
                    Outro
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bloodtype"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground font-medium">Tipo Sanguíneo (opcional)</FormLabel>
            <FormDescription>
              Selecione o tipo sanguíneo da criança, se conhecido
            </FormDescription>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-primary">
                  <SelectValue placeholder="Selecione o tipo sanguíneo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
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
            <FormLabel className="text-foreground font-medium">Observações</FormLabel>
            <FormDescription>
              Adicione informações relevantes sobre a criança, como condições especiais, 
              alergias ou outras observações importantes.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Digite aqui observações importantes sobre a criança..."
                className="resize-none min-h-[120px] border-gray-300 focus:border-primary"
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

export { GenderAndBloodType };
