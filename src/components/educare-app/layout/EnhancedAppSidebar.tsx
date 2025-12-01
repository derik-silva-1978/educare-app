
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { 
  Home, 
  Baby, 
  Bot,
  Calendar,
  Settings,
  User,
  Users,
  CreditCard,
  Crown,
  Shield,
  GraduationCap,
  UserCheck,
  MessageCircle,
  MessageSquare,
  UsersRound,
  FileVideo
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

// Interface para os itens de navegação
interface NavigationItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string;
}

// Função para obter itens de navegação baseado no role do usuário
const getNavigationItems = (userRole?: string): NavigationItem[] => {
  const baseItems = [
    {
      title: "Dashboard",
      url: "/educare-app/dashboard",
      icon: Home,
    },
    {
      title: "Crianças",
      url: "/educare-app/children",
      icon: Baby,
    },
    {
      title: "Jornada TitiNauta",
      url: "/educare-app/titinauta-journey",
      icon: Bot,
    },
    {
      title: "Atividades",
      url: "/educare-app/activities",
      icon: Calendar,
    },
    {
      title: "Comunicação",
      url: "/educare-app/communication",
      icon: MessageCircle,
    },
    {
      title: "Configurações",
      url: "/educare-app/settings",
      icon: Settings,
    },
  ];

  // Adicionar itens específicos para owner
  if (userRole === 'owner') {
    return [
      {
        title: "Dashboard Owner",
        url: "/educare-app/owner/dashboard",
        icon: Crown,
      },
      {
        title: "Gestão de Usuários",
        url: "/educare-app/owner/users",
        icon: Users,
      },
      {
        title: "Gestão de Profissionais",
        url: "/educare-app/owner/professionals",
        icon: GraduationCap,
      },
      {
        title: "Gestão de Equipes",
        url: "/educare-app/owner/teams",
        icon: UserCheck,
      },
      {
        title: "Gestão de Crianças",
        url: "/educare-app/owner/children",
        icon: UsersRound,
      },
      {
        title: "Gestão de Chats",
        url: "/educare-app/owner/chats",
        icon: MessageCircle,
      },
      {
        title: "Gestão de Perguntas",
        url: "/educare-app/admin/journey-questions",
        icon: MessageSquare,
      },
      {
        title: "Gestor de Mídias",
        url: "/educare-app/owner/media-resources",
        icon: FileVideo,
      },
      {
        title: "Gestão de Planos",
        url: "/educare-app/owner/plans",
        icon: CreditCard,
      },
      ...baseItems,
    ];
  }

  // Adicionar itens específicos para admin
  if (userRole === 'admin') {
    return [
      {
        title: "Dashboard Admin",
        url: "/educare-app/admin/dashboard",
        icon: Shield,
      },
      {
        title: "Gestão de Usuários",
        url: "/educare-app/admin/users",
        icon: Users,
      },
      {
        title: "Gestão de Profissionais",
        url: "/educare-app/admin/professionals",
        icon: GraduationCap,
      },
      {
        title: "Gestão de Equipes",
        url: "/educare-app/admin/teams",
        icon: UserCheck,
      },
      {
        title: "Gestão de Crianças",
        url: "/educare-app/admin/children",
        icon: UsersRound,
      },
      {
        title: "Gestão de Chats",
        url: "/educare-app/admin/chats",
        icon: MessageCircle,
      },
      {
        title: "Gestão de Perguntas",
        url: "/educare-app/admin/journey-questions",
        icon: MessageSquare,
      },
      {
        title: "Gestor de Mídias",
        url: "/educare-app/admin/media-resources",
        icon: FileVideo,
      },
      ...baseItems,
    ];
  }

  // Adicionar itens específicos para profissional
  if (userRole === 'professional') {
    return [
      {
        title: "Dashboard Profissional",
        url: "/educare-app/professional/dashboard",
        icon: GraduationCap,
      },
      {
        title: "Gestão de Crianças",
        url: "/educare-app/professional/children",
        icon: UsersRound,
      },
      {
        title: "Configurações",
        url: "/educare-app/settings",
        icon: Settings,
      },
    ];
  }

  return baseItems;
};

export function EnhancedAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  
  // Obter itens de navegação baseado no role do usuário
  const navigationItems = getNavigationItems(user?.role);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link to="/educare-app/dashboard" className="flex items-center space-x-2">
          {state === "expanded" ? (
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Educare+
            </span>
          ) : (
            <span className="font-display font-bold text-xl text-primary">E+</span>
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center space-x-2 p-2">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                {state === "expanded" && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.role === 'parent' ? 'Responsável' : 'Profissional'}
                    </p>
                  </div>
                )}
              </div>
            </SidebarMenuItem>
            
            {/* Botão de sair - visível em ambos os estados */}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout}>
                {state === "expanded" ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    <span>Sair</span>
                  </>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
