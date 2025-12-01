import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  MessageCircle, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRealTeamChat } from '@/hooks/useRealTeamChat';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { chatService } from '@/services/chatService';

interface Notification {
  id: string;
  type: 'message' | 'mention' | 'group_activity' | 'appointment' | 'milestone';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  sender?: {
    name: string;
    role: string;
  };
}

interface OnlineUser {
  id: string;
  name: string;
  role: string;
  lastSeen: Date;
  isOnline: boolean;
}

interface ChatNotificationsProps {
  childId: string;
  onNotificationClick?: (notification: Notification) => void;
}

export function ChatNotifications({ childId, onNotificationClick }: ChatNotificationsProps) {
  const { user } = useCustomAuth();
  const { group, participants, messages, isLoading } = useRealTeamChat(childId);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);

  // Gerar notificações baseadas em mensagens reais
  useEffect(() => {
    if (!messages || !user) return;

    const recentMessages = messages
      .filter(msg => msg.sender_id !== user.id) // Não incluir mensagens próprias
      .filter(msg => {
        const messageTime = new Date(msg.sent_at);
        const now = new Date();
        const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
        return diffInHours <= 24; // Mensagens das últimas 24 horas
      })
      .slice(-10); // Máximo 10 notificações

    const newNotifications: Notification[] = recentMessages.map(msg => ({
      id: msg.id,
      type: msg.message_type === 'ai_summary' ? 'milestone' : 'message',
      title: msg.message_type === 'ai_summary' ? 'Resumo da IA' : 'Nova mensagem',
      message: msg.message_content.length > 100 
        ? `${msg.message_content.substring(0, 100)}...` 
        : msg.message_content,
      timestamp: new Date(msg.sent_at),
      isRead: false, // Por enquanto, todas as notificações começam como não lidas
      priority: msg.message_type === 'ai_summary' ? 'high' : 'medium',
      sender: {
        name: msg.sender_name,
        role: msg.sender_role
      }
    }));

    setNotifications(newNotifications);
  }, [messages, user]);

  // Atualizar usuários online baseados nos participantes
  useEffect(() => {
    if (!participants) return;

    const onlineParticipants: OnlineUser[] = participants.map(participant => ({
      id: participant.user_id,
      name: `${participant.first_name} ${participant.last_name}`.trim(),
      role: participant.profile?.role || 'parent',
      lastSeen: new Date(participant.joined_at),
      isOnline: participant.is_active // Usar is_active como indicador de online
    }));

    setOnlineUsers(onlineParticipants);
  }, [participants]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      case 'mention':
        return <AlertCircle className="h-4 w-4" />;
      case 'group_activity':
        return <Users className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'milestone':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'parent':
        return 'bg-blue-500 text-white';
      case 'professional':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Botão de Notificações */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Centro de Notificações</h3>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Usuários Online */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participantes Online ({onlineUsers.filter(u => u.isOnline).length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getRoleColor(user.role)}>
                      {getAvatarInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-3 w-3 border-2 border-white rounded-full",
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.isOnline ? (
                      'Online agora'
                    ) : (
                      `Visto ${formatDistanceToNow(user.lastSeen, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}`
                    )}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {user.role === 'parent' ? 'Responsável' : 'Profissional'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Painel de Notificações */}
      {showNotifications && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                Notificações ({unreadCount} não lidas)
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                        !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-background"
                      )}
                      onClick={() => {
                        markAsRead(notification.id);
                        onNotificationClick?.(notification);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          getPriorityColor(notification.priority)
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </div>
                            
                            {notification.sender && (
                              <div className="text-xs text-muted-foreground">
                                {notification.sender.name}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
