
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/auth';
import { createDemoUser } from '@/utils/auth-utils';

// Simple demo users data
const DEMO_USERS: User[] = [
  { id: '1', name: 'Admin Demo', email: 'admin@smartpei.edu', role: 'admin' },
  { id: '2', name: 'Coordenador Demo', email: 'coord@smartpei.edu', role: 'coordinator' },
  { id: '3', name: 'Professor Demo', email: 'prof@smartpei.edu', role: 'teacher' },
  { id: '4', name: 'Especialista Demo', email: 'espec@smartpei.edu', role: 'specialist' },
  { id: '5', name: 'Psicólogo Demo', email: 'psico@smartpei.edu', role: 'psychologist' },
  { id: '6', name: 'Terapeuta Demo', email: 'tera@smartpei.edu', role: 'therapist' },
  { id: '7', name: 'Responsável Demo', email: 'resp@smartpei.edu', role: 'parent' },
];

export interface AddUserParams {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch users from an API
    const storedUsers = localStorage.getItem('smartPeiUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with demo users
      setUsers(DEMO_USERS);
      localStorage.setItem('smartPeiUsers', JSON.stringify(DEMO_USERS));
    }
    setIsLoading(false);
  }, []);

  const refreshUsers = () => {
    setIsLoading(true);
    // In a real application, you would refetch data from an API
    const storedUsers = localStorage.getItem('smartPeiUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    setIsLoading(false);
  };

  const addUser = (userData: AddUserParams) => {
    // In a real application, you would send data to an API
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('smartPeiUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Usuário adicionado",
      description: `${newUser.name} foi adicionado com sucesso.`,
    });
    
    return newUser;
  };

  const updateUser = (userData: User) => {
    // In a real application, you would send data to an API
    const updatedUsers = users.map(user => 
      user.id === userData.id ? { ...userData } : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('smartPeiUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Usuário atualizado",
      description: `${userData.name} foi atualizado com sucesso.`,
    });
    
    return userData;
  };

  const deleteUser = (userId: string) => {
    // In a real application, you would send a delete request to an API
    const userToDelete = users.find(user => user.id === userId);
    const updatedUsers = users.filter(user => user.id !== userId);
    
    setUsers(updatedUsers);
    localStorage.setItem('smartPeiUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Usuário excluído",
      description: userToDelete 
        ? `${userToDelete.name} foi excluído com sucesso.` 
        : "Usuário excluído com sucesso.",
    });
  };

  return {
    users,
    isLoading,
    refreshUsers,
    addUser,
    updateUser,
    deleteUser
  };
}

export default useUserManagement;
