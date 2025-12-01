
import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/auth';
import { RolePermissionMatrix } from './RolePermissionMatrix';
import { getRoleName } from '@/utils/auth-utils';

export const RoleManagement: React.FC = () => {
  // Use only valid UserRole types
  const roles: UserRole[] = [
    'admin',
    'teacher',
    'therapist',
    'parent',
    'professional',
    'student',
    'guest'
  ];
  
  const roleDescriptions: Record<string, string> = {
    admin: 'Acesso total ao sistema, incluindo gerenciamento de usuários e licenças.',
    teacher: 'Gerencia alunos, cria e edita PEIs e avaliações.',
    therapist: 'Fornece terapias específicas e acompanha progresso em áreas designadas.',
    parent: 'Visualiza informações sobre seu filho/dependente e acompanha progresso.',
    professional: 'Fornece avaliações e suporte técnico em sua área de expertise.',
    student: 'Acesso a conteúdo educacional e atividades.',
    guest: 'Acesso limitado para visualização de informações básicas do sistema.'
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{getRoleName(role)}</CardTitle>
                <Badge variant={role === 'admin' ? 'default' : 'outline'}>
                  {role === 'admin' ? 'Administrativo' : 'Padrão'}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 h-10">
                {roleDescriptions[role]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {role === 'admin' ? (
                  <p>Este papel tem todas as permissões do sistema.</p>
                ) : (
                  <p>Permissões específicas configuradas na matriz abaixo.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões</CardTitle>
          <CardDescription>
            Visualize as permissões disponíveis para cada papel no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RolePermissionMatrix roles={roles} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
