
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import UserProfileForm from './UserProfileForm';
import UserProfileCard from './UserProfileCard';
import { useToast } from '@/hooks/use-toast';

const mockUserProfile = {
  id: 'user-profile-1', // Added id property
  name: 'João Silva',
  description: 'Professor de educação especial com foco em crianças com TEA. Formado em Pedagogia com especialização em Educação Inclusiva.',
  photoUrl: '/placeholder.svg',
  position: 'Professor de Educação Especial',
  specialties: ['TEA', 'TDAH', 'Adaptação Curricular']
};

const UserProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [activeTab, setActiveTab] = useState('view');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveProfile = (data: any) => {
    // Ensure ID is preserved when updating the profile
    setUserProfile({
      ...data,
      id: userProfile.id
    });
    setActiveTab('view');
    
    toast({
      title: "Perfil atualizado",
      description: "Seu perfil foi atualizado com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Meu Perfil | Smart PEI</title>
      </Helmet>

      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 hover:bg-muted/30"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <h1 className="text-2xl font-bold mt-4 mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Visualize e edite suas informações de perfil.
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="view">Visualizar</TabsTrigger>
          <TabsTrigger value="edit">Editar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          <div className="max-w-md mx-auto">
            <UserProfileCard 
              profile={userProfile}
              isEditable
              onEdit={() => setActiveTab('edit')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
          <UserProfileForm
            initialData={userProfile}
            onSave={handleSaveProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
