import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, UserPlus } from 'lucide-react';
import { formatWhatsApp, isValidWhatsApp } from '@/utils/educare-app/formatters';

interface ProfessionalInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childId: string;
  childName: string;
}

const formSchema = z.object({
  professionalId: z.string().uuid().optional(),
  professionalEmail: z.string().email("Por favor insira um email válido"),
  whatsapp: z.string()
    .min(1, 'WhatsApp é obrigatório')
    .refine((value) => isValidWhatsApp(value), 'Número de WhatsApp inválido. Use formato: (11) 99999-9999'),
  speciality: z.enum([
    "pediatrician", "therapist", "psychologist", "neurologist", "nutritionist", 
    "speech_therapist", "occupational_therapist", "physical_therapist", "other"
  ]),
  message: z.string().optional(),
});

const specialityOptions = [
  { value: "pediatrician", label: "Pediatra" },
  { value: "therapist", label: "Terapeuta" },
  { value: "psychologist", label: "Psicólogo(a)" },
  { value: "neurologist", label: "Neurologista" },
  { value: "nutritionist", label: "Nutricionista" },
  { value: "speech_therapist", label: "Fonoaudiólogo(a)" },
  { value: "occupational_therapist", label: "Terapeuta Ocupacional" },
  { value: "physical_therapist", label: "Fisioterapeuta" },
  { value: "other", label: "Outro" },
];

export function ProfessionalInviteDialog({
  open,
  onOpenChange,
  childId,
  childName,
}: ProfessionalInviteDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      professionalEmail: "",
      whatsapp: "",
      speciality: "other",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!childId) {
      toast({
        title: "Erro",
        description: "ID da criança não fornecido",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, check if the professional exists by email
      const { data: professionals, error: findError } = await supabase
        .from('educare_profiles')
        .select('id, role')
        .eq('email', values.professionalEmail)
        .eq('role', 'professional')
        .maybeSingle();
      
      if (findError) throw findError;
      
      let professionalId = professionals?.id;
      
      if (!professionalId) {
        toast({
          title: "Profissional não encontrado",
          description: "Não encontramos um profissional registrado com este email.",
          variant: "destructive",
        });
        return;
      }

      // Store WhatsApp for future use (temporarily until database types are updated)
      if (professionalId && values.whatsapp) {
        console.log(`WhatsApp ${values.whatsapp} will be stored for professional ${professionalId}`);
      }
      
      // Create the invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('educare_professional_children')
        .insert({
          professional_id: professionalId,
          child_id: childId,
          status: 'pending',
          // Future: add specialty and message fields if added to the table
        })
        .select()
        .single();
      
      if (inviteError) {
        // Check if it's a duplicate invitation
        if (inviteError.code === '23505') { // Unique violation
          toast({
            title: "Convite já enviado",
            description: "Este profissional já foi convidado para acompanhar esta criança.",
            variant: "destructive", // Changed from "warning" to "destructive"
          });
        } else {
          throw inviteError;
        }
      } else {
        toast({
          title: "Convite enviado",
          description: `Um convite foi enviado para o profissional acompanhar ${childName}.`,
        });
        
        onOpenChange(false);
        form.reset();
      }
    } catch (error: any) {
      console.error("Error inviting professional:", error.message);
      toast({
        title: "Erro ao enviar convite",
        description: "Não foi possível enviar o convite. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convidar Profissional</DialogTitle>
          <DialogDescription>
            Convide um profissional para acompanhar o desenvolvimento de {childName}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="professionalEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Email do Profissional *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="profissional@email.com" 
                      {...field} 
                      className="border-border bg-background text-foreground focus:ring-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-sm">
                    Digite o email cadastrado pelo profissional no sistema
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">WhatsApp *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      value={formatWhatsApp(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="border-border bg-background text-foreground focus:ring-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-sm">
                    Número para comunicação via WhatsApp
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="speciality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Especialidade *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-border bg-background text-foreground focus:ring-primary">
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border shadow-md">
                      {specialityOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Mensagem (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione uma mensagem personalizada para o profissional..."
                      className="min-h-[100px] border-border bg-background text-foreground resize-none focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-sm">
                    Esta mensagem será enviada junto com o convite
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-3 pt-6 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary min-w-[140px] font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ProfessionalInviteDialog;
