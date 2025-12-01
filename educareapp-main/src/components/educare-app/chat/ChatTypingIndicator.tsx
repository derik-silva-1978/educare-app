import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TypingUser {
  id: string;
  name: string;
  role: string;
}

interface ChatTypingIndicatorProps {
  typingUsers: TypingUser[];
  className?: string;
}

export function ChatTypingIndicator({ typingUsers, className }: ChatTypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'parent':
        return 'bg-blue-500 text-white';
      case 'professional':
        return 'bg-green-500 text-white';
      case 'ai_assistant':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} está digitando...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} e ${typingUsers[1].name} estão digitando...`;
    } else {
      return `${typingUsers[0].name} e mais ${typingUsers.length - 1} pessoas estão digitando...`;
    }
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 bg-muted/50 rounded-lg", className)}>
      <div className="flex -space-x-2">
        {typingUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarFallback className={cn(getRoleColor(user.role), "text-xs")}>
              {getAvatarInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{getTypingText()}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
