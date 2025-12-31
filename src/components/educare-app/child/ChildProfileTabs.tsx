
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChildInfoTab } from './ChildInfoTab';
import { ChildReportsTab } from './ChildReportsTab';
import { User, FileText, MessageCircle } from 'lucide-react';
import { EnhancedTeamChat } from '../chat/EnhancedTeamChat';

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
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-50 to-slate-100 p-1.5 rounded-xl h-16 border border-slate-200 shadow-sm">
        <TabsTrigger 
          value="info" 
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200 data-[state=active]:scale-105 hover:bg-white hover:shadow-md transform"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">Informações</span>
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

      <TabsContent value="reports" className="mt-6">
        <ChildReportsTab childData={childData} childId={childId} />
      </TabsContent>

      <TabsContent value="communication" className="mt-6">
        <EnhancedTeamChat childId={childId} childName={childData?.name || childData?.first_name || 'Criança'} />
      </TabsContent>
    </Tabs>
  );
};
