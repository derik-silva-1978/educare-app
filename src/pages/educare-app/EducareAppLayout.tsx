
import React from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { EnhancedAppSidebar } from '@/components/educare-app/layout/EnhancedAppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { CustomBreadcrumb } from '@/components/educare-app/layout/CustomBreadcrumb';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { Button } from '@/components/ui/button';
import { LogOut, User, Key } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DarkModeToggle } from '@/components/educare-app/layout/DarkModeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const EducareAppLayout: React.FC = () => {
  const { user, isLoading, handleLogout, logout } = useAuth();
  const breadcrumbs = useBreadcrumbs();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 🚀 DEBUG: Log de entrada no layout
  console.log('🚀 EDUCAREAPPLAYOUT RENDERIZADO!', {
    pathname: location.pathname,
    userRole: user?.role,
    isLoading,
    hasUser: !!user
  });
  
  // Show loading while auth is loading
  if (isLoading) {
    console.log('🔄 EDUCAREAPPLAYOUT: Mostrando loading...');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    console.log('❌ EDUCAREAPPLAYOUT: Usuário não autenticado, redirecionando...');
    return <Navigate to="/educare-app/auth" replace />;
  }

  // Redirect professionals to their dashboard if they try to access other areas
  if (user.role === 'professional') {
    console.log('👨‍⚕️ EDUCAREAPPLAYOUT: Usuário é professional');
    const allowedPaths = [
      '/educare-app/professional/dashboard',
      '/educare-app/titinauta-journey',
      '/educare-app/settings'
    ];
    
    const isAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));
    
    if (!isAllowedPath) {
      console.log('❌ EDUCAREAPPLAYOUT: Professional tentando acessar área não permitida, redirecionando...');
      return <Navigate to="/educare-app/professional/dashboard" replace />;
    }
  }
  
  // Allow owners and admins to access their respective areas
  if (user.role === 'owner' || user.role === 'admin') {
    console.log('👑 EDUCAREAPPLAYOUT: Usuário é owner/admin', {
      role: user.role,
      pathname: location.pathname
    });
    const allowedPaths = [
      '/educare-app/owner/',
      '/educare-app/admin/',
      '/educare-app/welcome',
      '/educare-app/dashboard',
      '/educare-app/children',
      '/educare-app/child/',
      '/educare-app/journey-bot',
      '/educare-app/titinauta-journey',
      '/educare-app/titinauta',
      '/educare-app/activities',
      '/educare-app/communication',
      '/educare-app/settings'
    ];
    
    const isAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));
    console.log('🔍 EDUCAREAPPLAYOUT: Verificando paths permitidos', {
      allowedPaths,
      currentPath: location.pathname,
      isAllowedPath
    });
    
    // Se não for um path permitido, redirecionar para o dashboard apropriado
    if (!isAllowedPath) {
      const dashboardPath = user.role === 'owner' ? '/educare-app/owner/dashboard' : '/educare-app/admin/dashboard';
      console.log('❌ EDUCAREAPPLAYOUT: Path não permitido, redirecionando para:', dashboardPath);
      return <Navigate to={dashboardPath} replace />;
    }
  }

  console.log('✅ EDUCAREAPPLAYOUT: Renderizando layout principal!');
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <EnhancedAppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <CustomBreadcrumb breadcrumbs={breadcrumbs} />
            </div>
            
            {/* Dark Mode Toggle e Menu de usuário */}
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/educare-app/settings/change-password')} className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" />
                    <span>Trocar senha</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          
          <footer className="border-t py-4 text-center text-sm text-muted-foreground bg-background">
            © {new Date().getFullYear()} Educare. Todos os direitos reservados.
          </footer>
        </SidebarInset>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </SidebarProvider>
  );
};

export default EducareAppLayout;
