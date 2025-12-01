
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePermissions, Permission } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import useTeamManagement from "@/hooks/useTeamManagement";

interface PermissionGroupProps {
  title: string;
  permissions: Permission[];
  selectedRole: UserRole;
  rolePermissions: Record<UserRole, Permission[]>;
  onTogglePermission: (permission: Permission, role: UserRole) => void;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({ 
  title, 
  permissions, 
  selectedRole, 
  rolePermissions,
  onTogglePermission 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        {permissions.map(permission => (
          <div key={permission} className="flex items-center space-x-2">
            <Checkbox
              id={`${selectedRole}-${permission}`}
              checked={rolePermissions[selectedRole]?.includes(permission)}
              onCheckedChange={() => onTogglePermission(permission, selectedRole)}
            />
            <Label htmlFor={`${selectedRole}-${permission}`}>{permission}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TeamAccessManagement: React.FC = () => {
  const { toast } = useToast();
  const { getRoleName } = useAuth();
  const { teams } = useTeamManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");
  
  // Import the current permission configuration
  const { ROLE_PERMISSIONS: currentPermissions } = usePermissions();
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, Permission[]>>(currentPermissions);

  const roles: UserRole[] = [
    "admin",
    "manager",
    "coordinator",
    "teacher",
    "specialist",
    "psychologist",
    "therapist",
    "professional",
    "parent",
    "student",
    "guest"
  ];

  // Group permissions by category
  const licensePermissions: Permission[] = [
    'license.view', 'license.create', 'license.edit', 'license.delete', 'license.assign', 'license.validate'
  ];
  
  const teamPermissions: Permission[] = [
    'team.view', 'team.create', 'team.edit', 'team.delete'
  ];
  
  const userPermissions: Permission[] = [
    'user.view', 'user.create', 'user.edit', 'user.delete'
  ];

  const reportPermissions: Permission[] = [
    'report.view', 'report.generate'
  ];

  const studentPermissions: Permission[] = [
    'student.view', 'student.create', 'student.edit', 'student.delete'
  ];

  const assessmentPermissions: Permission[] = [
    'assessment.view', 'assessment.create', 'assessment.edit', 'assessment.delete'
  ];

  const handleTogglePermission = (permission: Permission, role: UserRole) => {
    setRolePermissions(prev => {
      const updatedPermissions = { ...prev };
      
      if (updatedPermissions[role].includes(permission)) {
        // Remove permission
        updatedPermissions[role] = updatedPermissions[role].filter(p => p !== permission);
      } else {
        // Add permission
        updatedPermissions[role] = [...updatedPermissions[role], permission];
      }
      
      return updatedPermissions;
    });
  };

  const handleSaveChanges = () => {
    // In a real application, this would be an API call to update permissions
    // For this demo, we'll just show a toast
    toast({
      title: "Permissões salvas",
      description: `As permissões para ${getRoleName(selectedRole)} foram atualizadas.`,
    });

    console.log("Updated permissions:", rolePermissions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Acesso às Equipes</CardTitle>
        <CardDescription>
          Configure as permissões para cada função no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1">
              <Label htmlFor="role-select" className="mb-2 block">
                Selecionar Função
              </Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {getRoleName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="search-teams" className="mb-2 block">
                Buscar Equipes
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-teams"
                  placeholder="Buscar por nome da equipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Permissões para {getRoleName(selectedRole)}</h2>
              
              <PermissionGroup 
                title="Licenças" 
                permissions={licensePermissions}
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                onTogglePermission={handleTogglePermission}
              />
              
              <PermissionGroup 
                title="Equipes" 
                permissions={teamPermissions}
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                onTogglePermission={handleTogglePermission}
              />
              
              <PermissionGroup 
                title="Usuários" 
                permissions={userPermissions}
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                onTogglePermission={handleTogglePermission}
              />
            </div>
            
            <div>
              <PermissionGroup 
                title="Relatórios" 
                permissions={reportPermissions}
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                onTogglePermission={handleTogglePermission}
              />
              
              <PermissionGroup 
                title="Estudantes" 
                permissions={studentPermissions}
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                onTogglePermission={handleTogglePermission}
              />
              
              <PermissionGroup 
                title="Avaliações" 
                permissions={assessmentPermissions}
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                onTogglePermission={handleTogglePermission}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveChanges} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Equipes Disponíveis</h2>
            
            {teams.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Equipe</TableHead>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams
                    .filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(team => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.studentName}</TableCell>
                        <TableCell>{team.members.length} membros</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Gerenciar Acessos
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma equipe encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAccessManagement;
