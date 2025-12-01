import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ProfessionalTeamChat } from './ProfessionalTeamChat';
import { ProfessionalTeamChat as TeamChatType } from '@/hooks/useProfessionalTeamChats';
import { 
  MessageCircle, 
  Users, 
  Calendar,
  ChevronRight
} from 'lucide-react';

interface ProfessionalChatInterfaceProps {
  teamChats: TeamChatType[];
}

export const ProfessionalChatInterface: React.FC<ProfessionalChatInterfaceProps> = ({
  teamChats
}) => {
  const [selectedChatId, setSelectedChatId] = useState<string>(
    teamChats.length > 0 ? teamChats[0].childId : ''
  );

  const selectedChat = teamChats.find(chat => chat.childId === selectedChatId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* Lista Lateral de Chats */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Chats Ativos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {teamChats.length} equipe{teamChats.length !== 1 ? 's' : ''} terapêutica{teamChats.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-0">
          <ScrollArea className="h-[580px]">
            <div className="p-4 space-y-2">
              {teamChats.map((teamChat, index) => (
                <Button
                  key={teamChat.childId}
                  variant={selectedChatId === teamChat.childId ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    selectedChatId === teamChat.childId 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedChatId(teamChat.childId)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      selectedChatId === teamChat.childId 
                        ? 'bg-blue-100' 
                        : 'bg-blue-50'
                    }`}>
                      <MessageCircle className={`h-4 w-4 ${
                        selectedChatId === teamChat.childId 
                          ? 'text-blue-600' 
                          : 'text-blue-500'
                      }`} />
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <p className={`font-medium text-sm truncate ${
                        selectedChatId === teamChat.childId 
                          ? 'text-white' 
                          : 'text-foreground'
                      }`}>
                        {teamChat.childName}
                      </p>
                      <p className={`text-xs truncate ${
                        selectedChatId === teamChat.childId 
                          ? 'text-blue-100' 
                          : 'text-muted-foreground'
                      }`}>
                        Equipe terapêutica
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className={`h-3 w-3 ${
                          selectedChatId === teamChat.childId 
                            ? 'text-blue-100' 
                            : 'text-muted-foreground'
                        }`} />
                        <span className={`text-xs ${
                          selectedChatId === teamChat.childId 
                            ? 'text-blue-100' 
                            : 'text-muted-foreground'
                        }`}>
                          {new Date(teamChat.joinedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {selectedChatId === teamChat.childId && (
                      <ChevronRight className="h-4 w-4 text-white flex-shrink-0" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Ativo */}
      <div className="lg:col-span-3">
        {selectedChat ? (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedChat.childName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Chat da equipe terapêutica
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    <Users className="h-3 w-3 mr-1" />
                    Equipe Ativa
                  </Badge>
                  <Badge variant="secondary">
                    Membro desde {new Date(selectedChat.joinedAt).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="p-0 h-[580px]">
              <ProfessionalTeamChat 
                teamId={selectedChat.teamId}
                childId={selectedChat.childId}
                childName={selectedChat.childName}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione um chat</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha um chat da lista lateral para começar a conversar
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
