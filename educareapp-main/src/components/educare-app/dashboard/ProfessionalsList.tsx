import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap,
  RefreshCw,
  Loader2,
  UserCheck,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { listProfessionals, Professional } from '@/services/api/professionalService';
import { toast } from 'sonner';

interface ProfessionalsListProps {
  className?: string;
}

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({ className }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar profissionais
  const loadProfessionals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await listProfessionals();
      
      if (response.success && response.data) {
        setProfessionals(response.data.professionals || []);
        console.log('✅ Profissionais carregados:', response.data.professionals?.length || 0);
      } else {
        setError(response.error || 'Erro ao carregar profissionais');
        console.error('❌ Erro ao carregar profissionais:', response.error);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao carregar profissionais';
      setError(errorMessage);
      console.error('💥 Erro inesperado:', err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar profissionais na inicialização
  useEffect(() => {
    loadProfessionals();
  }, []);

  // Função para obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Função para formatar especialização
  const formatSpecialization = (professional: Professional): string => {
    const profile = professional.profile;
    if (profile?.specialization) {
      return profile.specialization;
    }
    if (profile?.profession) {
      return profile.profession;
    }
    if (profile?.professional_specialty) {
      return profile.professional_specialty;
    }
    return 'Profissional de Saúde';
  };

  // Função para obter status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Função para formatar telefone
  const formatPhone = (phone?: string): string => {
    if (!phone) return '';
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    // Formata como (XX) XXXXX-XXXX
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissionais Disponíveis
          </CardTitle>
          <CardDescription>
            Conecte-se com profissionais especializados no desenvolvimento infantil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Carregando profissionais...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissionais Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={loadProfessionals}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissionais Disponíveis
          </CardTitle>
          <CardDescription>
            Conecte-se com profissionais especializados no desenvolvimento infantil
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadProfessionals}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhum profissional disponível no momento</p>
            <p className="text-sm mt-1">Novos profissionais serão exibidos aqui quando se cadastrarem</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {professionals.length} profissional{professionals.length !== 1 ? 'is' : ''} disponível{professionals.length !== 1 ? 'is' : ''}
              </p>
            </div>
            
            <div className="grid gap-4">
              {professionals.map((professional, index) => (
                <div key={professional.id}>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={professional.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {professional.name}
                        </h4>
                        {getStatusBadge(professional.status)}
                        {professional.profile?.is_verified && (
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <GraduationCap className="h-4 w-4 inline mr-1" />
                        {formatSpecialization(professional)}
                      </p>
                      
                      {professional.profile?.bio && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {professional.profile.bio}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {professional.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{professional.email}</span>
                          </div>
                        )}
                        {professional.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{formatPhone(professional.phone)}</span>
                          </div>
                        )}
                        {professional.profile?.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{professional.profile.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Conversar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Agendar
                      </Button>
                    </div>
                  </div>
                  
                  {index < professionals.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalsList;
