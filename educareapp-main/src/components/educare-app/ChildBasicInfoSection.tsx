
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UseFormReturn } from 'react-hook-form';
import { ChildFormValues } from '@/schema/educare-app/childFormSchema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  form: UseFormReturn<ChildFormValues>;
  isLoading: boolean;
}

const ChildBasicInfoSection: React.FC<Props> = ({ form, isLoading }) => {
  const birthDate = form.watch('birthDate');
  
  // Calculate age display
  const getAgeDisplay = (birthDateStr: string) => {
    if (!birthDateStr) return '';
    
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    
    if (ageInYears >= 2) {
      return `${ageInYears} ${ageInYears === 1 ? 'ano' : 'anos'}`;
    } else {
      return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-medium">
                Nome <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite o nome da criança" 
                  {...field} 
                  disabled={isLoading}
                  className="bg-background border-gray-300 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-medium">
                Sobrenome <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite o sobrenome da criança" 
                  {...field} 
                  disabled={isLoading}
                  className="bg-background border-gray-300 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-medium text-gray-800">
                Data de nascimento <span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-background border-gray-300 focus:border-primary",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data de nascimento</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Format date as YYYY-MM-DD for the form
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        field.onChange(formattedDate);
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {birthDate && (
                <p className="text-sm text-primary font-medium">
                  Idade: {getAgeDisplay(birthDate)}
                </p>
              )}
              <FormDescription>
                Selecione a data de nascimento da criança
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-medium">
                Gênero <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="bg-background border-gray-300 focus:border-primary">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-medium">Cidade</FormLabel>
              <FormDescription>
                Cidade onde a criança reside (opcional)
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Ex: São Paulo"
                  {...field}
                  disabled={isLoading}
                  className="bg-background border-gray-300 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-medium">Nacionalidade</FormLabel>
              <FormDescription>
                Nacionalidade da criança (opcional)
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Ex: Brasileira"
                  {...field}
                  disabled={isLoading}
                  className="bg-background border-gray-300 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 font-medium">CPF</FormLabel>
            <FormDescription>
              Documento da criança (opcional)
            </FormDescription>
            <FormControl>
              <Input
                placeholder="000.000.000-00"
                {...field}
                disabled={isLoading}
                maxLength={14}
                className="bg-background border-gray-300 focus:border-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ChildBasicInfoSection;
