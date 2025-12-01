
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { UserRole } from '@/types/auth';
import { PencilIcon } from 'lucide-react';

interface ProfileSettingsProps {
  onSave: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onSave }) => {
  const { currentUser } = useAuth();
  
  // Mock user data - in a real app, this would come from user context
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Usuário Smart PEI',
    email: currentUser?.email || 'usuario@smartpei.com',
    role: currentUser?.role || 'teacher',
    bio: 'Professor de educação inclusiva com 5 anos de experiência em adaptações curriculares.',
    institution: 'Escola Municipal Inclusão',
    phone: '(11) 98765-4321',
    avatarUrl: currentUser?.avatar || ''
  });
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile data:', profileData);
    onSave();
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e profissionais
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={profileData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione sua função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Professor</SelectItem>
                      <SelectItem value="coordinator">Coordenador</SelectItem>
                      <SelectItem value="psychologist">Psicólogo</SelectItem>
                      <SelectItem value="therapist">Terapeuta</SelectItem>
                      <SelectItem value="parent">Responsável</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Instituição</Label>
            <Input
              id="institution"
              value={profileData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              placeholder="Conte um pouco sobre você, sua experiência e formação..."
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => console.log('Cancel profile changes')}
          >
            Cancelar
          </Button>
          <Button type="submit">
            Salvar alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileSettings;
