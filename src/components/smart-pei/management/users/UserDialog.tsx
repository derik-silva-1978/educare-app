
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole } from '@/types/auth';
import { useUserManagement } from '@/hooks/useUserManagement';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onClose: () => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({ 
  open, 
  onOpenChange, 
  user, 
  onClose 
}) => {
  const { addUser, updateUser } = useUserManagement();
  const isEditMode = !!user;
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'teacher' as UserRole,
      password: ''
    }
  });
  
  React.useEffect(() => {
    if (open) {
      reset({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'teacher' as UserRole,
        password: ''
      });
    }
  }, [open, user, reset]);
  
  const onSubmit = (data: any) => {
    if (isEditMode && user) {
      updateUser({
        ...user,
        name: data.name,
        email: data.email,
        role: data.role,
        ...(data.password ? { password: data.password } : {})
      });
    } else {
      addUser({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password
      });
    }
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Modifique os detalhes do usuário e clique em Salvar quando terminar.' 
              : 'Preencha os detalhes do novo usuário e clique em Criar quando terminar.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register('name', { required: "Nome é obrigatório" })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: "Email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido"
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Papel</Label>
            <Select 
              defaultValue={user?.role || 'teacher'}
              onValueChange={(value) => setValue('role', value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="teacher">Professor</SelectItem>
                <SelectItem value="specialist">Especialista</SelectItem>
                <SelectItem value="coordinator">Coordenador</SelectItem>
                <SelectItem value="psychologist">Psicólogo</SelectItem>
                <SelectItem value="therapist">Terapeuta</SelectItem>
                <SelectItem value="parent">Responsável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditMode ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password', { 
                ...(isEditMode ? {} : { required: "Senha é obrigatória" }),
                minLength: {
                  value: 6,
                  message: "Senha deve ter pelo menos 6 caracteres"
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
