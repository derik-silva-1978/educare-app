
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TitibotProvider } from '../titibot/TitibotProvider';
import TourContent from './TourContent';
import DashboardContent from './DashboardContent';

export const SmartPEITourTabs: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    // If user is logged in, navigate to dashboard, otherwise show login form
    const isLoggedIn = localStorage.getItem('smartPeiLoggedIn') === 'true';
    
    if (isLoggedIn) {
      navigate('/smart-pei/dashboard');
    } else {
      navigate('/auth?redirect=smart-pei');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 overflow-x-hidden">
      <Tabs defaultValue="tour" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
          <TabsTrigger value="tour" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" aria-label="Ver tour interativo">
            <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>Tour Interativo</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" aria-label="Ver demonstração do dashboard">
            <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>Dashboard</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tour" className="mt-0">
          <TourContent handleGetStarted={handleGetStarted} />
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-0">
          <TitibotProvider>
            <DashboardContent handleGetStarted={handleGetStarted} />
          </TitibotProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartPEITourTabs;
