
import React from 'react';
import { X, ArrowDownLeft, Settings, MessageSquare, HelpCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TitibotChatTab from './components/TitibotChatTab';
import TitibotSmartPEITab from './components/TitibotSmartPEITab';
import TitibotPEIHelpTab from './components/TitibotPEIHelpTab';
import TitibotSettings from './components/TitibotSettings';
import { useTitibot } from './TitibotProvider';

// Import CSS files
import './styles/titibot.css';
import './styles/titibot-animations.css';
import './styles/titibot-position.css';
import './styles/titibot-messages.css';
import './styles/titibot-input.css';
import './styles/titibot-layout.css';

const Titibot: React.FC = () => {
  const { 
    isOpen, 
    closeTitibot, 
    position, 
    isPremium 
  } = useTitibot();

  // Function to handle prompt clicks from different tabs
  const handlePromptClick = (promptText: string) => {
    // This would typically update the chat input or directly send a message
    console.log(`Selected prompt: ${promptText}`);
    // In a full implementation, you might want to:
    // - Set the input value to the prompt text
    // - Or directly send the prompt as a message
    // For now, we'll just log it
  };

  if (!isOpen) {
    return null;
  }

  // Determine position classes based on the selected position
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-24 right-6';
      case 'bottom-left':
        return 'bottom-24 left-6';
      case 'right-side':
        return 'right-24 top-1/2 -translate-y-1/2';
      default:
        return 'bottom-24 right-6';
    }
  };

  return (
    <div className={`titibot-container fixed z-50 w-80 h-[500px] shadow-lg rounded-lg bg-white ${getPositionClasses()} animate-fade-in`}>
      <Card className="border-0 shadow-none h-full rounded-lg overflow-hidden">
        <CardHeader className="p-3 border-b space-y-0 flex flex-row items-center justify-between bg-slate-800 text-white">
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-primary'}`}>
              {isPremium ? (
                <Zap className="h-5 w-5 text-white" />
              ) : (
                <ArrowDownLeft className="h-5 w-5 text-white" />
              )}
            </div>
            <h3 className="text-sm font-medium text-white">
              {isPremium ? 'Titibot Turbo' : 'Titibot'}
            </h3>
            {isPremium && (
              <span className="bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded">
                Premium
              </span>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={closeTitibot}
              aria-label="Fechar Titibot"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-[calc(100%-52px)]">
          <Tabs defaultValue="chat" className="h-full">
            <div className="border-b bg-slate-100">
              <TabsList className="w-full justify-start px-2 h-10 bg-transparent">
                <TabsTrigger value="chat" className="text-xs data-[state=active]:bg-primary/10 text-slate-900">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="smart-pei" className="text-xs data-[state=active]:bg-primary/10 text-slate-900">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Smart PEI
                </TabsTrigger>
                <TabsTrigger value="pei-help" className="text-xs data-[state=active]:bg-primary/10 text-slate-900">
                  PEI
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-primary/10 text-slate-900">
                  <Settings className="h-3 w-3 mr-1" />
                  Config
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="h-[calc(100%-40px)] p-0 m-0 data-[state=active]:block">
              <TitibotChatTab />
            </TabsContent>
            
            <TabsContent value="smart-pei" className="h-[calc(100%-40px)] p-0 m-0 overflow-auto">
              <TitibotSmartPEITab onPromptClick={handlePromptClick} />
            </TabsContent>
            
            <TabsContent value="pei-help" className="h-[calc(100%-40px)] p-0 m-0 overflow-auto">
              <TitibotPEIHelpTab onPromptClick={handlePromptClick} />
            </TabsContent>
            
            <TabsContent value="settings" className="h-[calc(100%-40px)] p-0 m-0 overflow-auto">
              <TitibotSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Titibot;
