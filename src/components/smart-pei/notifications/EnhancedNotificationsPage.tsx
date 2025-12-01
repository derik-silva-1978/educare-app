import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedProgressBar from '../assessment/EnhancedProgressBar';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, Check, CheckCheck, Clock, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  category: 'assessment' | 'student' | 'activity' | 'system';
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Avaliação Pendente',
    message: 'Há uma avaliação pendente para o aluno João Silva',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    category: 'assessment',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Atividade Concluída',
    message: 'A atividade "Exercício de Matemática" foi concluída por Maria Santos',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    category: 'activity',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Novo Aluno Adicionado',
    message: 'Um novo aluno, Pedro Alves, foi adicionado ao sistema',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: false,
    category: 'student',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Manutenção do Sistema',
    message: 'O sistema estará em manutenção amanhã das 22h às 00h',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
    category: 'system',
    priority: 'low'
  },
];

export const EnhancedNotificationsPage: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    assessment: true,
    student: true,
    activity: true,
    system: true
  });
  
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          if (newProgress >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [loading]);
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread' && notification.read) return false;
    if (activeTab === 'read' && !notification.read) return false;
    
    if (!selectedCategories[notification.category]) return false;
    
    return true;
  });
  
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    toast({
      title: "Notifica��ão marcada como lida",
      description: "A notificação foi marcada como lida com sucesso.",
      variant: "default"
    });
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas com sucesso.",
      variant: "default"
    });
  };
  
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours} horas atrás`;
    return `${diffDays} dias atrás`;
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assessment': return <div className="text-purple-500">📋</div>;
      case 'student': return <div className="text-blue-500">👨‍🎓</div>;
      case 'activity': return <div className="text-green-500">📝</div>;
      case 'system': return <div className="text-gray-500">⚙️</div>;
      default: return <div>📢</div>;
    }
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Centro de Notificações</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar Todas Como Lidas
          </Button>
        </div>
      </div>
      
      {loading ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Carregando notificações...</h3>
            <EnhancedProgressBar 
              value={loadingProgress} 
              showPercent={true}
              height="md"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Filtros de Notificação</CardTitle>
                    <CardDescription>Personalize quais tipos de notificações deseja ver</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-sm font-medium mb-2">Categorias</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedCategories.assessment} 
                          onCheckedChange={() => toggleCategory('assessment')} 
                        />
                        <span>Avaliações</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedCategories.student} 
                          onCheckedChange={() => toggleCategory('student')} 
                        />
                        <span>Estudantes</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedCategories.activity} 
                          onCheckedChange={() => toggleCategory('activity')} 
                        />
                        <span>Atividades</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedCategories.system} 
                          onCheckedChange={() => toggleCategory('system')} 
                        />
                        <span>Sistema</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Suas Notificações</CardTitle>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {notifications.filter(n => !n.read).length} não lidas
                </div>
              </div>
              <CardDescription>
                Mantenha-se atualizado com notificações sobre estudantes, avaliações e mais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">
                    <Bell className="mr-2 h-4 w-4" />
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    <Bell className="mr-2 h-4 w-4" />
                    Não Lidas
                  </TabsTrigger>
                  <TabsTrigger value="read">
                    <BellOff className="mr-2 h-4 w-4" />
                    Lidas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-4">
                    {sortedNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {activeTab === 'unread' 
                            ? 'Não há notificações não lidas.' 
                            : activeTab === 'read' 
                              ? 'Não há notificações lidas.' 
                              : 'Não há notificações disponíveis.'}
                        </p>
                      </div>
                    ) : (
                      sortedNotifications.map(notification => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className={`overflow-hidden border-l-4 ${notification.read ? 'border-l-gray-200' : `border-l-${getPriorityColor(notification.priority).replace('bg-', '')}`}`}>
                            <div className={`p-4 ${notification.read ? '' : 'bg-primary/5'}`}>
                              <div className="flex items-start">
                                <div className="mr-3 mt-1">
                                  {getCategoryIcon(notification.category)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h3 className={`font-medium ${notification.read ? '' : 'text-primary'}`}>
                                      {notification.title}
                                    </h3>
                                    <div className="flex items-center">
                                      <span className="text-xs text-muted-foreground mr-2">
                                        <Clock className="inline h-3 w-3 mr-1" />
                                        {formatRelativeTime(notification.date)}
                                      </span>
                                      {!notification.read && (
                                        <Button 
                                          size="icon" 
                                          variant="ghost" 
                                          className="h-6 w-6" 
                                          onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EnhancedNotificationsPage;
