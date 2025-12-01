
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserMinus, 
  Mail, 
  ClipboardList, 
  Calendar,
  UserPlus 
} from 'lucide-react';
import ProfessionalInviteDialog from './ProfessionalInviteDialog';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

export interface Professional {
  id: string;
  name: string;
  email: string;
  type: string;
  avatar?: string;
  lastActivity?: string;
  status: 'active' | 'pending' | 'inactive';
}

interface ProfessionalsConnectedProps {
  childId: string;
  childName: string;
  professionals: Professional[];
  onProfessionalRemoved?: (professionalId: string) => void;
}

export function ProfessionalsConnected({
  childId,
  childName,
  professionals,
  onProfessionalRemoved
}: ProfessionalsConnectedProps) {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const isParent = hasRole('parent');

  const handleRemoveProfessional = (professionalId: string, professionalName: string) => {
    // In a real app, this would call an API to remove the professional
    console.log('Removing professional:', professionalId);
    
    if (onProfessionalRemoved) {
      onProfessionalRemoved(professionalId);
    }
    
    toast({
      title: 'Profissional removido',
      description: `${professionalName} não tem mais acesso aos dados desta criança.`,
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      physician: 'Médico',
      therapist: 'Terapeuta',
      psychologist: 'Psicólogo',
      nutritionist: 'Nutricionista',
      speech_therapist: 'Fonoaudiólogo',
      occupational_therapist: 'Terapeuta Ocupacional',
      physical_therapist: 'Fisioterapeuta',
      educator: 'Educador',
      other: 'Outro',
    };
    
    return types[type] || 'Profissional';
  };

  const getStatusBadge = (status: Professional['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Inativo</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profissionais Conectados</CardTitle>
          <CardDescription>
            Profissionais que acompanham o desenvolvimento de {childName}
          </CardDescription>
        </div>
        {isParent && (
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Profissional
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {isParent 
              ? "Nenhum profissional foi adicionado ainda. Convide profissionais para acompanhar o desenvolvimento desta criança."
              : "Nenhum profissional está conectado a esta criança."}
          </div>
        ) : (
          <div className="space-y-4">
            {professionals.map((professional) => (
              <div 
                key={professional.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={professional.avatar} />
                    <AvatarFallback>
                      {professional.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {professional.name}
                      {getStatusBadge(professional.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getTypeLabel(professional.type)}
                    </div>
                    {professional.lastActivity && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Última atividade: {professional.lastActivity}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-foreground"
                    title="Enviar mensagem"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-foreground"
                    title="Ver anotações"
                  >
                    <ClipboardList className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-foreground"
                    title="Agendar consulta"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  
                  {isParent && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      title="Remover profissional"
                      onClick={() => handleRemoveProfessional(professional.id, professional.name)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <ProfessionalInviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        childId={childId}
        childName={childName}
      />
    </Card>
  );
}

export default ProfessionalsConnected;
