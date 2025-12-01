
import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { UserRole } from '@/types/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Shield, User, Mail, LogOut, Star, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoleName } from '@/utils/auth-utils';

export const UserProfile: React.FC = () => {
  const { user, handleLogout } = useAuth();
  
  if (!user) {
    return null;
  }
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get color for the access level badge
  const getAccessLevelColor = (level?: string) => {
    switch (level) {
      case 'premium': return 'bg-amber-500 hover:bg-amber-600';
      case 'enterprise': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl text-center">{user.name}</CardTitle>
        <CardDescription className="text-center flex items-center justify-center gap-1">
          <Shield className="h-4 w-4" />
          {getRoleName(user.role as UserRole)}
        </CardDescription>
        
        {user.accessLevel && (
          <div className="flex justify-center mt-2">
            <Badge className={`${getAccessLevelColor(user.accessLevel)}`}>
              {user.accessLevel === 'basic' ? 'Plano Básico' : 
               user.accessLevel === 'premium' ? 'Plano Premium' : 'Plano Enterprise'}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">ID:</span> 
          <span className="text-muted-foreground">{user.id}</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Email:</span> 
          <span className="text-muted-foreground">{user.email}</span>
        </div>

        {user.plan && (
          <div className="space-y-3 p-4 border rounded-md border-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Plano:</span>
                <span>{user.plan.name}</span>
              </div>
              
              {user.plan.expiresAt && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Expira em: {new Date(user.plan.expiresAt).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
            
            {user.plan.features && user.plan.features.length > 0 && (
              <div className="text-sm space-y-1">
                <p className="font-medium">Recursos incluídos:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {user.plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {(user.plan.maxStudents || user.plan.maxAssessments) && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {user.plan.maxStudents && (
                  <div className="bg-muted p-2 rounded-md text-center">
                    <div className="font-medium">Estudantes</div>
                    <div>{user.plan.maxStudents}</div>
                  </div>
                )}
                {user.plan.maxAssessments && (
                  <div className="bg-muted p-2 rounded-md text-center">
                    <div className="font-medium">Avaliações</div>
                    <div>{user.plan.maxAssessments}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
