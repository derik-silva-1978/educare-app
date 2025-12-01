import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManualSection } from '@/components/smart-pei/help/UserManualSection';
import { FAQSection } from '@/components/smart-pei/sections/FAQSection';
import { TutorialSection } from '@/components/smart-pei/sections/TutorialSection';
import { SupportSection } from '@/components/smart-pei/help/SupportSection';

type TabValue = 'manual' | 'tutorials' | 'faq' | 'support';

const HelpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<TabValue>('manual');

  // Parse tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['manual', 'tutorials', 'faq', 'support'].includes(tabParam)) {
      setActiveTab(tabParam as TabValue);
    } else if (location.pathname.includes('/help/manual/')) {
      setActiveTab('manual');
    } else if (location.pathname.includes('/help/tutorials/')) {
      setActiveTab('tutorials');
    }
  }, [location.search, location.pathname]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as TabValue;
    setActiveTab(newTab);
    
    // Keep the path clean with just query parameters for the main help page
    navigate(`/smart-pei/help?tab=${newTab}`, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Ajuda e Suporte | Smart PEI</title>
        <meta name="description" content="Ajuda, tutoriais e perguntas frequentes sobre o Smart PEI" />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Ajuda e Suporte</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="manual">Manual do Usuário</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriais em Vídeo</TabsTrigger>
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="mt-6">
            <UserManualSection />
          </TabsContent>
          
          <TabsContent value="tutorials" className="mt-6">
            <TutorialSection />
          </TabsContent>
          
          <TabsContent value="faq" className="mt-6">
            <FAQSection />
          </TabsContent>
          
          <TabsContent value="support" className="mt-6">
            <SupportSection />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default HelpPage;
