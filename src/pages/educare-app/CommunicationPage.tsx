import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { EnhancedTeamChat } from '@/components/educare-app/chat/EnhancedTeamChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CommunicationPage: React.FC = () => {
  const { user } = useCustomAuth();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Buscar crianças do usuário
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ['user-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('educare_children')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching children:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Selecionar automaticamente a primeira criança se não houver seleção
  React.useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  if (childrenLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Comunicação
          </h1>
          <p className="text-gray-600">
            Converse com a equipe de profissionais que acompanha suas crianças
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma criança cadastrada</h3>
            <p className="text-gray-600 text-center mb-4">
              Para acessar a comunicação com profissionais, você precisa ter pelo menos uma criança cadastrada.
            </p>
            <Button asChild>
              <a href="/educare-app/children">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Criança
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedChild = children.find(child => child.id === selectedChildId);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comunicação
        </h1>
        <p className="text-gray-600">
          Converse com a equipe de profissionais que acompanha suas crianças
        </p>
      </div>

      {/* Seletor de criança se houver múltiplas */}
      {children.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selecione a criança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChildId === child.id ? "default" : "outline"}
                  onClick={() => setSelectedChildId(child.id)}
                  className="flex items-center gap-2"
                >
                  {child.first_name} {child.last_name}
                  {selectedChildId === child.id && (
                    <Badge variant="secondary" className="ml-2">
                      Ativo
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat da criança selecionada */}
      {selectedChild && (
        <div className="min-h-[600px]">
          <EnhancedTeamChat 
            childId={selectedChild.id}
            childName={`${selectedChild.first_name} ${selectedChild.last_name}`}
          />
        </div>
      )}
    </div>
  );
};

export default CommunicationPage;
