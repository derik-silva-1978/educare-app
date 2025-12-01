
import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useCustomChildren } from '@/hooks/educare-app/useCustomChildren';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, MapPin, Edit, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChildProfileTabs } from '@/components/educare-app/child/ChildProfileTabs';
import { calculateAge, formatAge } from '@/utils/dateUtils';
import { Spinner } from '@/components/ui/spinner';

const ChildProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { children, isLoading } = useCustomChildren();
  const [activeTab, setActiveTab] = useState('info');

  if (!user || !id) {
    return <Navigate to="/educare-app/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      </div>
    );
  }

  const child = children?.find(c => c.id === id);

  if (!child) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Criança não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              A criança que você está procurando não foi encontrada ou você não tem permissão para visualizá-la.
            </p>
            <Button onClick={() => navigate('/educare-app/children')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = calculateAge ? calculateAge(child.birthdate) : { years: 0, months: 0 };
  const ageFormatted = formatAge(child.birthdate);
  const isParent = user.role === 'parent';

  return (
    <>
      <Helmet>
        <title>{child.first_name} {child.last_name} - Perfil da Criança | Educare</title>
        <meta name="description" content={`Perfil e informações de ${child.first_name} ${child.last_name}`} />
      </Helmet>

      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/educare-app/children')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {child.first_name.charAt(0)}{child.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {child.first_name} {child.last_name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{ageFormatted}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="capitalize">{child.gender}</span>
                      </div>
                      
                      {(child as any).city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{(child as any).city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {isParent ? 'Filho(a)' : 'Paciente'}
                    </Badge>
                    {(child as any).bloodtype && (
                      <Badge variant="outline">
                        Tipo {(child as any).bloodtype}
                      </Badge>
                    )}
                    
                    {/* Edit Button - Only for parents */}
                    {isParent && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Opções</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => navigate(`/educare-app/child/${child.id}/edit`)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Editar Perfil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <ChildProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          childId={child.id}
          childData={child}
          isParent={isParent}
        />
      </div>
    </>
  );
};

export default ChildProfile;
