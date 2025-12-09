import React from 'react';
import { Sun, Moon, Bell, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

interface IconToolbarProps {
  notificationCount?: number;
  onFeedbackClick?: () => void;
  onTitiNautaClick?: () => void;
}

const IconToolbar: React.FC<IconToolbarProps> = ({
  notificationCount = 0,
  onFeedbackClick,
  onTitiNautaClick,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9"
        title="Alternar tema"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-5 w-5 text-blue-400" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 relative"
        title="Notificações"
        onClick={() => navigate('/educare-app/settings')}
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        title="Feedback"
        onClick={onFeedbackClick}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        title="Atividades"
        onClick={() => navigate('/educare-app/activities')}
      >
        <Calendar className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        title="TitiNauta"
        onClick={onTitiNautaClick || (() => navigate('/educare-app/titinauta'))}
      >
        <Sparkles className="h-5 w-5 text-purple-500" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate('/educare-app/settings')}>
            Configurações
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/educare-app/support')}>
            Ajuda
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()} className="text-red-600">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default IconToolbar;
