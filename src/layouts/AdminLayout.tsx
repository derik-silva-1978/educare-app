
import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  User,
  Shield,
  BookOpen,
  ClipboardList,
  Map,
  Bookmark,
  Home,
  Activity,
  FileBarChart,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AdminLayout: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  
  // If no user or not admin, redirect to admin login
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/auth');
    }
  }, [user, navigate]);
  
  const handleLogoutClick = () => {
    handleLogout();
    navigate('/admin/auth');
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return 'AD';
    return user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Educare+</title>
      </Helmet>
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar variant="inset" className="bg-slate-800 text-white border-r border-slate-700">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-3">
                <Shield className="h-6 w-6 text-amber-500" />
                <div className="font-semibold text-xl text-white">Admin Portal</div>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              {user && (
                <div className="px-4 py-3 mb-2 bg-slate-700 rounded-md mx-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8 border-2 border-amber-500">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-amber-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm line-clamp-1 text-white">{user.name || user.email}</div>
                      <Badge variant="outline" className="text-xs bg-amber-600 border-amber-700 text-white">
                        Administrador
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <SidebarGroup>
                <SidebarGroupLabel className="text-slate-300">Dashboard</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/dashboard')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/users')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <Users className="h-5 w-5" />
                      <span>Gerenciar Usuários</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/analytics')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <Activity className="h-5 w-5" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel className="text-slate-300">Conteúdo</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/quiz')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <ClipboardList className="h-5 w-5" />
                      <span>Quizzes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/journey')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <Map className="h-5 w-5" />
                      <span>Jornadas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/materials')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Materiais</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/journey-questions')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Gestão de Perguntas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel className="text-slate-300">Sistema</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/settings')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Configurações</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/logs')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <FileBarChart className="h-5 w-5" />
                      <span>Logs de Atividade</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/admin/notifications')}
                      className="text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <Bell className="h-5 w-5" />
                      <span>Notificações</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="border-t border-slate-700">
              <div className="px-4 py-3 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start bg-transparent text-slate-200 border-slate-600 hover:bg-slate-700 hover:text-white" 
                  onClick={() => navigate('/')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  App Principal
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                  onClick={handleLogoutClick}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <header className="border-b bg-white shadow-sm py-3 px-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-medium text-slate-800">Admin Portal</h1>
                  <div className="text-sm text-slate-600">
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </header>
              <main className="flex-1 p-6 bg-gray-50">
                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
