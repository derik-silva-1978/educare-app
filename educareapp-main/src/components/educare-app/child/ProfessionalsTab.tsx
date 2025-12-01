
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';

interface ProfessionalRequest {
  id: string;
  professional_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  educare_profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

interface ProfessionalsTabProps {
  childId: string;
}

const ProfessionalsTab: React.FC<ProfessionalsTabProps> = ({ childId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ProfessionalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  useEffect(() => {
    fetchProfessionalRequests();
  }, [childId]);

  const fetchProfessionalRequests = async () => {
    if (!user || !childId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('educare_professional_children')
        .select(`
          id,
          professional_id,
          status,
          created_at,
          educare_profiles!professional_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('child_id', childId);

      if (error) throw error;

      const typedData = (data || []).map(item => ({
        id: item.id,
        professional_id: item.professional_id,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at,
        educare_profiles: Array.isArray(item.educare_profiles) 
          ? item.educare_profiles[0] 
          : item.educare_profiles
      }));

      setRequests(typedData);
    } catch (error: any) {
      console.error('Error fetching professional requests:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResponse = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setProcessingRequest(requestId);
      
      const { error } = await supabase
        .from('educare_professional_children')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus }
            : req
        )
      );

      toast({
        title: newStatus === 'approved' ? "Solicitação aprovada" : "Solicitação rejeitada",
        description: `A solicitação foi ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`
      });

    } catch (error: any) {
      console.error('Error updating request:', error);
      toast({
        title: "Erro ao processar solicitação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando solicitações...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de Profissionais</CardTitle>
        <CardDescription>
          Gerencie as solicitações de acesso de profissionais para esta criança
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Nenhuma solicitação de profissional encontrada.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">
                    {request.educare_profiles?.first_name} {request.educare_profiles?.last_name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {request.educare_profiles?.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solicitado em: {new Date(request.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(request.status)}
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestResponse(request.id, 'approved')}
                        disabled={processingRequest === request.id}
                      >
                        {processingRequest === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestResponse(request.id, 'rejected')}
                        disabled={processingRequest === request.id}
                      >
                        {processingRequest === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalsTab;
