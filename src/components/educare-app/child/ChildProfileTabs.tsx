
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChildInfoTab } from './ChildInfoTab';
import { ChildReportsTab } from './ChildReportsTab';
import { Bot, User, FileText, MessageCircle } from 'lucide-react';
import { TitiNautaAvatar } from '../titinauta/TitiNautaAvatar';
import { EnhancedTeamChat } from '../chat/EnhancedTeamChat';
import { useNavigate } from 'react-router-dom';

interface ChildProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  childId: string;
  childData?: {
    id: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    gender?: string;
    [key: string]: unknown;
  };
  isParent: boolean;
}

export const ChildProfileTabs: React.FC<ChildProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  childId,
  childData,
  isParent
}) => {
  const navigate = useNavigate();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-50 to-slate-100 p-1.5 rounded-xl h-16 border border-slate-200 shadow-sm">
        <TabsTrigger 
          value="info" 
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200 data-[state=active]:scale-105 hover:bg-white hover:shadow-md transform"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">Informações</span>
        </TabsTrigger>
        <TabsTrigger 
          value="journey-bot" 
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200 data-[state=active]:scale-105 hover:bg-white hover:shadow-md transform"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">TitiNauta</span>
        </TabsTrigger>
        <TabsTrigger 
          value="reports" 
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-200 data-[state=active]:scale-105 hover:bg-white hover:shadow-md transform"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">Relatórios</span>
        </TabsTrigger>
        <TabsTrigger 
          value="communication" 
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-200 data-[state=active]:scale-105 hover:bg-white hover:shadow-md transform"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">Chat</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <ChildInfoTab childData={childData} />
      </TabsContent>

      <TabsContent value="journey-bot" className="mt-6">
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <TitiNautaAvatar size="xl" mood="happy" />
          </div>
          <h3 className="text-xl font-semibold mb-2">TitiNauta</h3>
          <p className="text-gray-600 mb-4">
            Converse com o TitiNauta sobre o desenvolvimento da criança
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate(`/educare-app/journey-bot-whatsapp/${childId}`)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              💬 Conversar com TitiNauta
            </button>
            <button 
              onClick={() => navigate(`/educare-app/titinauta-media/${childId}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              🎥 TitiNauta 2.0 <span className="bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">Novo</span>
            </button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reports" className="mt-6">
        <ChildReportsTab childData={childData} childId={childId} />
      </TabsContent>

      <TabsContent value="communication" className="mt-6">
        <EnhancedTeamChat childId={childId} childName={childData?.name || childData?.first_name || 'Criança'} />
      </TabsContent>
    </Tabs>
  );
};
