
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { UserRole } from '@/types/auth';
import { getRoleName } from '@/utils/auth-utils';

interface RolePermissionMatrixProps {
  roles: UserRole[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'user' | 'student' | 'assessment' | 'pei' | 'report' | 'admin';
  allowedRoles: UserRole[];
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({ roles }) => {
  const permissions: Permission[] = [
    // User Management
    { 
      id: 'view_users', 
      name: 'Visualizar Usuários', 
      description: 'Ver lista de usuários do sistema',
      category: 'user',
      allowedRoles: ['admin'] 
    },
    { 
      id: 'manage_users', 
      name: 'Gerenciar Usuários', 
      description: 'Criar, editar e excluir usuários',
      category: 'user',
      allowedRoles: ['admin'] 
    },
    
    // Student Management
    { 
      id: 'view_students', 
      name: 'Visualizar Alunos', 
      description: 'Ver lista de alunos',
      category: 'student',
      allowedRoles: ['admin', 'teacher', 'professional', 'therapist'] 
    },
    { 
      id: 'manage_students', 
      name: 'Gerenciar Alunos', 
      description: 'Adicionar e editar alunos',
      category: 'student',
      allowedRoles: ['admin', 'teacher'] 
    },
    
    // Assessment Management
    { 
      id: 'view_assessments', 
      name: 'Visualizar Avaliações', 
      description: 'Ver avaliações de alunos',
      category: 'assessment',
      allowedRoles: ['admin', 'teacher', 'professional', 'therapist'] 
    },
    { 
      id: 'create_assessments', 
      name: 'Criar Avaliações', 
      description: 'Criar novas avaliações',
      category: 'assessment',
      allowedRoles: ['admin', 'teacher', 'professional'] 
    },
    
    // PEI Management
    { 
      id: 'view_peis', 
      name: 'Visualizar PEIs', 
      description: 'Ver planos educacionais individualizados',
      category: 'pei',
      allowedRoles: ['admin', 'teacher', 'professional', 'therapist', 'parent'] 
    },
    { 
      id: 'manage_peis', 
      name: 'Gerenciar PEIs', 
      description: 'Criar e editar PEIs',
      category: 'pei',
      allowedRoles: ['admin', 'teacher'] 
    },
    
    // Report Management
    { 
      id: 'view_reports', 
      name: 'Visualizar Relatórios', 
      description: 'Ver relatórios do sistema',
      category: 'report',
      allowedRoles: ['admin', 'teacher'] 
    },
    { 
      id: 'generate_reports', 
      name: 'Gerar Relatórios', 
      description: 'Criar novos relatórios',
      category: 'report',
      allowedRoles: ['admin', 'teacher'] 
    },
    
    // Admin Features
    { 
      id: 'manage_licenses', 
      name: 'Gerenciar Licenças', 
      description: 'Administrar licenças do sistema',
      category: 'admin',
      allowedRoles: ['admin'] 
    },
    { 
      id: 'view_analytics', 
      name: 'Visualizar Análises', 
      description: 'Acessar estatísticas e métricas',
      category: 'admin',
      allowedRoles: ['admin'] 
    },
  ];
  
  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
  
  const categoryNames: Record<string, string> = {
    user: 'Usuários',
    student: 'Alunos',
    assessment: 'Avaliações',
    pei: 'PEIs',
    report: 'Relatórios',
    admin: 'Administração'
  };
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Permissão</TableHead>
            {roles.map((role) => (
              <TableHead key={role} className="text-center">
                {getRoleName(role)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <React.Fragment key={category}>
              <TableRow>
                <TableCell colSpan={roles.length + 1} className="bg-muted/50 font-medium">
                  {categoryNames[category]}
                </TableCell>
              </TableRow>
              {perms.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    <div>{permission.name}</div>
                    <div className="text-xs text-muted-foreground">{permission.description}</div>
                  </TableCell>
                  {roles.map((role) => (
                    <TableCell key={role} className="text-center">
                      {permission.allowedRoles.includes(role) ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RolePermissionMatrix;
