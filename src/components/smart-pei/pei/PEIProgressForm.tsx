
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, X, Plus, TrendingUp, TrendingDown, Minus, CheckCircle, ArrowRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PEIProgressFormProps {
  goalId: string;
  onAddProgress: (progress: any) => void;
  onCancel?: () => void;
}

// Status options with display text and icons
const statusOptions = [
  { 
    value: 'regression', 
    label: 'Regressão', 
    description: 'Houve retrocesso em relação ao objetivo',
    icon: <TrendingDown className="h-4 w-4 text-red-600" />,
    color: 'text-red-600 border-red-200 bg-red-50'
  },
  { 
    value: 'no_change', 
    label: 'Sem Mudança', 
    description: 'Não houve progresso significativo',
    icon: <Minus className="h-4 w-4 text-gray-600" />,
    color: 'text-gray-600 border-gray-200 bg-gray-50'
  },
  { 
    value: 'minor_progress', 
    label: 'Progresso Menor', 
    description: 'Houve algum progresso, mas ainda limitado',
    icon: <ArrowRight className="h-4 w-4 text-blue-600" />,
    color: 'text-blue-600 border-blue-200 bg-blue-50'
  },
  { 
    value: 'significant_progress', 
    label: 'Progresso Significativo', 
    description: 'Houve progresso notável em direção ao objetivo',
    icon: <TrendingUp className="h-4 w-4 text-green-600" />,
    color: 'text-green-600 border-green-200 bg-green-50'
  },
  { 
    value: 'achieved', 
    label: 'Alcançado', 
    description: 'O objetivo foi completamente alcançado',
    icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
    color: 'text-emerald-600 border-emerald-200 bg-emerald-50'
  }
];

// Form validation schema
const formSchema = z.object({
  date: z.date({
    required_error: "A data do registro é obrigatória",
  }),
  notes: z.string().min(1, "As observações são obrigatórias"),
  evidence: z.string().optional(),
  status: z.enum(['regression', 'no_change', 'minor_progress', 'significant_progress', 'achieved'], {
    required_error: "O status de progresso é obrigatório",
  }),
  author: z.string().optional(),
});

export const PEIProgressForm: React.FC<PEIProgressFormProps> = ({ 
  goalId, 
  onAddProgress,
  onCancel 
}) => {
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      notes: '',
      evidence: '',
      status: 'no_change',
      author: '',
    }
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Get the display label for the status
    const statusLabel = statusOptions.find(option => option.value === values.status)?.label || values.status;
    
    // Add progress with both value and display text
    onAddProgress({
      ...values,
      date: values.date.toISOString(),
      statusDisplay: statusLabel
    });
    
    // Reset form
    form.reset({
      date: new Date(),
      notes: '',
      evidence: '',
      status: 'no_change',
      author: '',
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registrar Progresso</h3>
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Registro</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: pt })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do Progresso</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status de progresso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {statusOptions.find(s => s.value === form.watch('status'))?.description}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o progresso observado" 
                    {...field} 
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="evidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidências</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva as evidências que comprovam o progresso" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Opcional. Forneça detalhes sobre as evidências que demonstram o progresso.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registrado por</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome de quem está registrando o progresso" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Opcional. Identifique quem está realizando este registro.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status preview */}
          {form.watch('status') && (
            <div className={`p-3 rounded-md border ${statusOptions.find(s => s.value === form.watch('status'))?.color}`}>
              <div className="flex items-center gap-2">
                {statusOptions.find(s => s.value === form.watch('status'))?.icon}
                <span className="font-medium">{statusOptions.find(s => s.value === form.watch('status'))?.label}</span>
              </div>
              <p className="text-sm mt-1">
                {statusOptions.find(s => s.value === form.watch('status'))?.description}
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Registro
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PEIProgressForm;
