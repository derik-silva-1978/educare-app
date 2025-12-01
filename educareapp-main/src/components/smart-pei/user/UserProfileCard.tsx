
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Edit } from 'lucide-react';

interface UserProfileProps {
  profile: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    position?: string;
    specialties?: string[];
    description?: string;
  };
  isEditable?: boolean;
  onEdit?: () => void;
}

const UserProfileCard: React.FC<UserProfileProps> = ({ 
  profile,
  isEditable = false,
  onEdit
}) => {
  const { name, email, phone, photoUrl, position, specialties, description } = profile;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={photoUrl || '/placeholder.svg'} alt={name} />
            <AvatarFallback className="text-xl">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{name}</h3>
          {position && (
            <p className="text-muted-foreground">{position}</p>
          )}
        </div>
        
        {(email || phone) && (
          <div className="space-y-2 mb-4">
            {email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        )}
        
        {specialties && specialties.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Especialidades</h4>
            <div className="text-sm">
              {specialties.join(', ')}
            </div>
          </div>
        )}
        
        {description && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Sobre</h4>
            <p className="text-sm">{description}</p>
          </div>
        )}
        
        {isEditable && onEdit && (
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Editar Perfil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
