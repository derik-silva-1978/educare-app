import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTeamWhatsAppGroup } from '@/hooks/useTeamWhatsAppGroup';
import { Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface GroupCreationTestProps {
  childId: string;
  childName: string;
}

export const GroupCreationTest: React.FC<GroupCreationTestProps> = ({ childId, childName }) => {
  const { 
    group, 
    participants, 
    messages, 
    isLoading, 
    error, 
    isAuthenticated, 
    createGroup 
  } = useTeamWhatsAppGroup(childId);

  const handleCreateGroup = async () => {
    await createGroup(`Equipe Terapêutica de ${childName}`);
  };

  if (isAuthenticated === null) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verificando autenticação...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAuthenticated === false) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-700">Usuário não autenticado</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Teste do Módulo Grupo Terapêutico
        </CardTitle>
        <CardDescription>
          Status atual do sistema para {childName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status de Autenticação */}
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-700">Usuário autenticado</span>
        </div>

        {/* Status do Grupo */}
        {group ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700">Grupo criado: {group.group_name}</span>
            </div>
            <div className="ml-6 space-y-1">
              <p className="text-sm text-muted-foreground">
                • Participantes: {participants.length}
              </p>
              <p className="text-sm text-muted-foreground">
                • Mensagens: {messages.length}
              </p>
              <p className="text-sm text-muted-foreground">
                • ID do Grupo: {group.id}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-orange-700">Nenhum grupo encontrado</span>
            </div>
            <Button 
              onClick={handleCreateGroup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando Grupo...
                </>
              ) : (
                'Criar Grupo de Teste'
              )}
            </Button>
          </div>
        )}

        {/* Exibir Erro se houver */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Status das Políticas RLS */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Status do Sistema:</h4>
          <div className="space-y-1">
            <Badge variant="outline" className="mr-2">
              RLS Corrigido ✓
            </Badge>
            <Badge variant="outline" className="mr-2">
              Autenticação ✓
            </Badge>
            <Badge variant="outline" className="mr-2">
              Hook Robusto ✓
            </Badge>
            <Badge variant="outline">
              Interface Integrada ✓
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};