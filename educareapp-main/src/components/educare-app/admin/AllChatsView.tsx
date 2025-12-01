import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  RefreshCw,
  BarChart3,
  Eye,
  Calendar,
  Search,
  Filter,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useChatRBAC } from '@/hooks/useChatRBAC';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function AllChatsView() {
  const { user } = useCustomAuth();
  const navigate = useNavigate();
  const { 
    allChatsData, 
    isLoading, 
    error, 
    canViewAllChats, 
    loadAllChats 
  } = useChatRBAC();

  // Estados para pesquisa e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'professional' | 'parent' | 'child'>('all');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Verificar permissão de acesso
  useEffect(() => {
    if (!canViewAllChats) {
      toast({
        title: "Acesso negado",
        description: "Apenas proprietários e administradores podem visualizar todos os chats.",
        variant: "destructive",
      });
      navigate('/educare-app/dashboard');
      return;
    }

    // Carregar dados automaticamente
    loadAllChats();
  }, [canViewAllChats, loadAllChats, navigate]);

  const handleViewChat = (groupId: string) => {
    // Navegar para o chat específico
    navigate(`/educare-app/chat/${groupId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Extrair listas únicas de participantes para os filtros
  const { professionals, parents, children } = useMemo(() => {
    if (!allChatsData?.groups) {
      return { professionals: [], parents: [], children: [] };
    }

    const professionalsSet = new Set<string>();
    const parentsSet = new Set<string>();
    const childrenSet = new Set<string>();

    allChatsData.groups.forEach(group => {
      // Extrair informações dos participantes da equipe
      if (group.team?.members) {
        group.team.members.forEach(member => {
          if (member.user) {
            const userName = member.user.name;
            if (member.user.role === 'professional') {
              professionalsSet.add(userName);
            } else if (member.user.role === 'parent' || member.user.role === 'user') {
              parentsSet.add(userName);
            }
          }
        });
      }

      // Extrair nomes de crianças dos nomes dos grupos
      if (group.name.includes('(') && group.name.includes(')')) {
        const childMatch = group.name.match(/\(([^)]+)\)/);
        if (childMatch) {
          childrenSet.add(childMatch[1]);
        }
      }
    });

    return {
      professionals: Array.from(professionalsSet).sort(),
      parents: Array.from(parentsSet).sort(),
      children: Array.from(childrenSet).sort()
    };
  }, [allChatsData?.groups]);

  // Filtrar grupos baseado na pesquisa e filtros
  const filteredGroups = useMemo(() => {
    if (!allChatsData?.groups) return [];

    let filtered = allChatsData.groups;

    // Filtro por texto de pesquisa
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchLower) ||
        group.description?.toLowerCase().includes(searchLower) ||
        group.team?.name.toLowerCase().includes(searchLower) ||
        group.stats.lastMessage?.content.toLowerCase().includes(searchLower) ||
        group.stats.lastMessage?.sender.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por tipo e valor específico
    if (filterType !== 'all' && selectedFilter) {
      filtered = filtered.filter(group => {
        switch (filterType) {
          case 'professional':
            return group.team?.members?.some(member => 
              member.user?.role === 'professional' && 
              member.user?.name === selectedFilter
            );
          case 'parent':
            return group.team?.members?.some(member => 
              (member.user?.role === 'parent' || member.user?.role === 'user') && 
              member.user?.name === selectedFilter
            );
          case 'child':
            return group.name.includes(`(${selectedFilter})`);
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allChatsData?.groups, searchTerm, filterType, selectedFilter]);

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setSelectedFilter('');
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = searchTerm || filterType !== 'all' || selectedFilter;

  // Verificar se deve mostrar os chats (apenas após aplicar filtros)
  const shouldShowChats = hasActiveFilters;

  // Contar total de chats disponíveis
  const totalChats = allChatsData?.groups?.length || 0;

  if (!canViewAllChats) {
    return null; // Componente será desmontado pela navegação
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Carregando chats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar chats: {error}</p>
            <Button 
              onClick={loadAllChats} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allChatsData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum dado de chat disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { groups = [], summary = { totalGroups: 0, totalMessages: 0, totalParticipants: 0 } } = allChatsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visão Global dos Chats</h1>
          <p className="text-muted-foreground">
            Todos os grupos de chat do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
          <Button onClick={loadAllChats} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Pesquisa */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome do grupo, descrição, equipe, mensagem ou remetente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Filtros Avançados */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Filtrar por:</label>
                  <Select value={filterType} onValueChange={(value: 'all' | 'professional' | 'parent' | 'child') => {
                    setFilterType(value);
                    setSelectedFilter('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="parent">Pais/Responsáveis</SelectItem>
                      <SelectItem value="child">Criança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {filterType === 'professional' && 'Profissional:'}
                    {filterType === 'parent' && 'Pai/Responsável:'}
                    {filterType === 'child' && 'Criança:'}
                    {filterType === 'all' && 'Valor:'}
                  </label>
                  <Select 
                    value={selectedFilter} 
                    onValueChange={setSelectedFilter}
                    disabled={filterType === 'all'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        filterType === 'all' ? 'Selecione um tipo primeiro' :
                        filterType === 'professional' ? 'Selecionar profissional' :
                        filterType === 'parent' ? 'Selecionar pai/responsável' :
                        filterType === 'child' ? 'Selecionar criança' : 'Selecionar'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {filterType === 'professional' && professionals.map(prof => (
                        <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                      {filterType === 'parent' && parents.map(parent => (
                        <SelectItem key={parent} value={parent}>{parent}</SelectItem>
                      ))}
                      {filterType === 'child' && children.map(child => (
                        <SelectItem key={child} value={child}>{child}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}

            {/* Indicador de Resultados */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {shouldShowChats 
                  ? `Mostrando ${filteredGroups.length} de ${totalChats} grupos`
                  : `${totalChats} grupos de chat disponíveis`
                }
              </span>
              {hasActiveFilters && (
                <Badge variant="outline" className="text-xs">
                  Filtros ativos
                </Badge>
              )}
            </div>
            
            {!shouldShowChats && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Search className="h-4 w-4" />
                  <span className="font-medium">Use a pesquisa ou filtros para visualizar os chats</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Para melhor performance, os chats são exibidos apenas após aplicar pesquisa ou filtros específicos.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Grupos</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              Grupos de chat ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Mensagens enviadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Usuários participando
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Grupos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Grupos de Chat 
            {shouldShowChats ? `(${filteredGroups.length}/${totalChats})` : `(${totalChats})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shouldShowChats ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum grupo encontrado com os filtros aplicados</p>
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(group.name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{group.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {group.team?.name || 'Sem equipe'}
                              </Badge>
                            </div>
                            
                            {group.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {group.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {group.stats.messageCount} mensagens
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {group.stats.participantCount} participantes
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Criado {formatDistanceToNow(new Date(group.created_at), {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </div>
                            </div>
                            
                            {group.stats.lastMessage && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="font-medium">
                                    {group.stats.lastMessage.sender}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatDistanceToNow(new Date(group.stats.lastMessage.sentAt), {
                                      addSuffix: true,
                                      locale: ptBR
                                    })}
                                  </span>
                                </div>
                                <p className="truncate">
                                  {group.stats.lastMessage.content}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewChat(group.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Chat
                        </Button>
                      </div>
                    </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Use os filtros para visualizar os chats</h3>
                <p className="text-muted-foreground mb-6">
                  Com {totalChats} grupos de chat no sistema, use a pesquisa ou filtros acima para encontrar os chats que você precisa.
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span>Pesquise por nome, descrição ou mensagem</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Filtre por profissional, pai ou criança</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
