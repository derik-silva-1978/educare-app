
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Bell, Send, Check, EyeOff, Users, Settings, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock notifications data
const notificationHistory = [
  {
    id: '1',
    title: 'Novo Quiz Disponível',
    message: 'Um novo quiz para crianças de 3-4 anos foi adicionado.',
    sentTo: 'Pais/Responsáveis',
    sentAt: '2025-04-28T10:15:00',
    status: 'delivered',
    readCount: 24,
    targetCount: 65
  },
  {
    id: '2',
    title: 'Manutenção Programada',
    message: 'O sistema ficará indisponível por 2 horas para manutenção no dia 30/04.',
    sentTo: 'Todos Usuários',
    sentAt: '2025-04-27T14:30:00',
    status: 'delivered',
    readCount: 87,
    targetCount: 243
  },
  {
    id: '3',
    title: 'Novos Materiais de Apoio',
    message: 'Adicionamos novos materiais sobre desenvolvimento infantil na seção de Materiais de Apoio.',
    sentTo: 'Profissionais',
    sentAt: '2025-04-26T09:45:00',
    status: 'delivered',
    readCount: 18,
    targetCount: 38
  },
  {
    id: '4',
    title: 'Atualização de Termos',
    message: 'Nossos termos de serviço foram atualizados. Por favor, revise as alterações.',
    sentTo: 'Todos Usuários',
    sentAt: '2025-04-23T11:20:00',
    status: 'delivered',
    readCount: 156,
    targetCount: 243
  }
];

const AdminNotifications: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [urgent, setUrgent] = useState(false);
  
  const handleSendNotification = () => {
    // Validate form
    if (!title.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e a mensagem da notificação.",
      });
      return;
    }
    
    // In a real application, this would send the notification to users
    toast({
      title: "Notificação enviada",
      description: `Sua notificação foi enviada para ${targetAudience === 'all' ? 'todos os usuários' : targetAudience}.`,
    });
    
    // Reset form
    setTitle('');
    setMessage('');
    setTargetAudience('all');
    setUrgent(false);
  };
  
  const getTargetAudienceName = (target: string) => {
    switch(target) {
      case 'all': return 'Todos Usuários';
      case 'parents': return 'Pais/Responsáveis';
      case 'professionals': return 'Profissionais';
      case 'admins': return 'Administradores';
      default: return target;
    }
  };
  
  const getReadRatePercentage = (readCount: number, targetCount: number) => {
    return Math.round((readCount / targetCount) * 100);
  };

  return (
    <>
      <Helmet>
        <title>Notificações | Admin Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciamento de Notificações</h1>
          <Badge className="bg-amber-600">Sistema de Notificação</Badge>
        </div>
        
        <Tabs defaultValue="send" className="space-y-4">
          <TabsList>
            <TabsTrigger value="send">
              <Send className="h-4 w-4 mr-2" />
              Enviar Notificação
            </TabsTrigger>
            <TabsTrigger value="history">
              <Bell className="h-4 w-4 mr-2" />
              Histórico de Notificações
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Nova Notificação</CardTitle>
                <CardDescription>
                  Crie e envie notificações para usuários do Educare+
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Notificação</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Novos materiais disponíveis"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Digite a mensagem da notificação..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Público-Alvo</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger id="targetAudience">
                        <SelectValue placeholder="Selecione o público-alvo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Usuários</SelectItem>
                        <SelectItem value="parents">Apenas Pais/Responsáveis</SelectItem>
                        <SelectItem value="professionals">Apenas Profissionais</SelectItem>
                        <SelectItem value="admins">Apenas Administradores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgent"
                      checked={urgent}
                      onCheckedChange={setUrgent}
                    />
                    <Label htmlFor="urgent">Marcar como urgente</Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button variant="outline" className="mr-2">
                  Cancelar
                </Button>
                <Button onClick={handleSendNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Notificação
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Notificações</CardTitle>
                <CardDescription>
                  Notificações enviadas anteriormente e suas estatísticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Data de Envio</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Público-Alvo</TableHead>
                        <TableHead className="hidden md:table-cell">Taxa de Leitura</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notificationHistory.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell className="font-medium">
                            {new Date(notification.sentAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>{notification.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{notification.sentTo}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-amber-600 h-2.5 rounded-full"
                                  style={{ width: `${getReadRatePercentage(notification.readCount, notification.targetCount)}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {notification.readCount}/{notification.targetCount} ({getReadRatePercentage(notification.readCount, notification.targetCount)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {notification.status === 'delivered' ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Entregue
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Pendente</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificação</CardTitle>
                <CardDescription>
                  Gerencie como as notificações são processadas e entregues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canais de Entrega</h3>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-amber-600" />
                        <Label htmlFor="push-notifications" className="font-medium">Notificações no App</Label>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-amber-600" />
                        <Label htmlFor="email-notifications" className="font-medium">Notificações por Email</Label>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferências</h3>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex flex-col">
                        <Label htmlFor="batch-notifications" className="font-medium">Agrupamento de Notificações</Label>
                        <p className="text-sm text-gray-500">Limitar frequência de notificações enviadas</p>
                      </div>
                      <Switch id="batch-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <Label htmlFor="quiet-hours" className="font-medium">Horário de Silêncio</Label>
                        <p className="text-sm text-gray-500">Não enviar notificações entre 22h e 8h</p>
                      </div>
                      <Switch id="quiet-hours" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">Salvar Configurações</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminNotifications;
