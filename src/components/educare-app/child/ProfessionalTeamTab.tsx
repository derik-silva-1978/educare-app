
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, UserCog, Mail, AlertTriangle, Trash2 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfessionalTeamTabProps {
  childId: string;
}

// Interface for professional data
interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'active' | 'declined';
  invitedAt: string;
}

// Form schema for inviting professionals
const inviteFormSchema = z.object({
  email: z.string().email({
    message: "Por favor insira um email válido",
  }),
  role: z.string().min(1, {
    message: "Por favor, selecione uma especialidade",
  }),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export const ProfessionalTeamTab: React.FC<ProfessionalTeamTabProps> = ({ childId }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: InviteFormValues) => {
    try {
      // Simulate API call to send invite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the "invited" professional to our state
      const newProfessional: Professional = {
        id: `prof-${Date.now()}`,
        name: data.email.split('@')[0], // Just for demo purposes
        email: data.email,
        role: data.role,
        status: 'pending',
        invitedAt: new Date().toISOString(),
      };
      
      setProfessionals(prev => [...prev, newProfessional]);
      
      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${data.email}`,
      });
      
      setInviteDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar convite",
        description: "Ocorreu um erro ao enviar o convite. Tente novamente.",
      });
    }
  };
  
  const handleRemoveProfessional = (id: string) => {
    setProfessionals(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Profissional removido",
      description: "O profissional foi removido com sucesso.",
    });
  };
  
  const handleResendInvite = (email: string) => {
    toast({
      title: "Convite reenviado",
      description: `Um novo convite foi enviado para ${email}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Equipe de Profissionais</h2>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Profissional</DialogTitle>
              <DialogDescription>
                Convide um profissional para acompanhar o desenvolvimento da criança.
                O profissional receberá um e-mail com instruções para aceitar o convite.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do Profissional</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma especialidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="psychologist">Psicólogo(a)</SelectItem>
                          <SelectItem value="speech-therapist">Fonoaudiólogo(a)</SelectItem>
                          <SelectItem value="occupational-therapist">Terapeuta Ocupacional</SelectItem>
                          <SelectItem value="physical-therapist">Fisioterapeuta</SelectItem>
                          <SelectItem value="pediatrician">Pediatra</SelectItem>
                          <SelectItem value="neurologist">Neurologista</SelectItem>
                          <SelectItem value="teacher">Professor(a)</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Adicione uma mensagem personalizada ao convite..."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta mensagem será incluída no email de convite.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Enviar Convite</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {professionals.length > 0 ? (
        <div className="space-y-4">
          {professionals.map(prof => (
            <Card key={prof.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <UserCog className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{prof.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>{prof.email}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Especialidade: </span>
                      {prof.role}
                    </div>
                    {prof.status === 'pending' && (
                      <div className="flex items-center text-xs text-yellow-600 mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span>Convite pendente</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {prof.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResendInvite(prof.email)}
                    >
                      Reenviar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveProfessional(prof.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <UserCog className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <h3 className="text-lg font-medium mb-2">Nenhum profissional na equipe</h3>
            <p className="text-muted-foreground mb-6">
              Convide profissionais para colaborar no acompanhamento da criança.
            </p>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar Profissional
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sobre a Equipe Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              A equipe de profissionais é composta por especialistas convidados por você para
              acompanhar o desenvolvimento da criança.
            </p>
            <p>
              <strong>Como funciona:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Convide profissionais através do email deles
              </li>
              <li>
                Os profissionais recebem um convite e precisam aceitá-lo
              </li>
              <li>
                Após aceitar, eles terão acesso às avaliações e poderão colaborar
              </li>
              <li>
                Você mantém controle total sobre quem tem acesso às informações
              </li>
            </ul>
            <p>
              <strong>Privacidade:</strong> Você pode remover um profissional da equipe a qualquer momento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalTeamTab;
