
import { useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomePanel from '@/components/dashboard/WelcomePanel';
import StatisticsCards from '@/components/dashboard/StatisticsCards';
import RecentActivities from '@/components/dashboard/RecentActivities';
import CallToActionPanel from '@/components/dashboard/CallToActionPanel';

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <DashboardHeader />
        
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Panel */}
            <WelcomePanel />
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Visão Geral</h3>
              <StatisticsCards />
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Atividades Recentes</h3>
              <RecentActivities />
            </div>
            
            {/* Call to Action */}
            <CallToActionPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
