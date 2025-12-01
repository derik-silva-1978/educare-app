
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfileFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    photoUrl?: string;
    position?: string;
    specialties?: string[];
  };
  onSave: (data: any) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ initialData, onSave }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [specialties, setSpecialties] = useState(initialData?.specialties?.join(', ') || '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl || null);
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload the file to a server
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!name.trim()) {
      toast({
        title: "Nome é obrigatório",
        description: "Por favor, preencha seu nome para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Split specialties string into array
    const specialtiesArray = specialties
      .split(',')
      .map(s => s.trim())
      .filter(s => s);

    const profileData = {
      id: initialData?.id, // Preserve the ID
      name,
      description,
      photoUrl: photoPreview || photoUrl,
      position,
      specialties: specialtiesArray,
      updatedAt: new Date().toISOString()
    };

    onSave(profileData);

    toast({
      title: "Perfil atualizado",
      description: "Seu perfil foi atualizado com sucesso.",
    });
  };

  const handleCancelPhotoChange = () => {
    setPhotoPreview(initialData?.photoUrl || null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Seu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-primary/20">
                <AvatarImage src={photoPreview || '/placeholder.svg'} alt={name} />
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Label 
                htmlFor="photo-upload" 
                className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Enviar foto</span>
              </Label>
              <Input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoChange}
              />
            </div>
            {photoPreview && photoPreview !== initialData?.photoUrl && (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelPhotoChange}
                >
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Cargo/Função</Label>
            <Input 
              id="position" 
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              placeholder="Ex: Professor, Psicólogo, Coordenador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties">Especialidades (separe por vírgulas)</Label>
            <Input 
              id="specialties" 
              value={specialties} 
              onChange={(e) => setSpecialties(e.target.value)} 
              placeholder="Ex: Educação Especial, TEA, TDAH"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Sobre Você</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Uma breve descrição sobre você, sua formação e experiência"
              rows={4}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit">
              <Check className="h-4 w-4 mr-2" />
              Salvar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default UserProfileForm;
