
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/educare-app/layout/AppSidebar';
import DashboardHeader from '@/components/educare-app/layout/DashboardHeader';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Toaster } from '@/components/ui/toaster';

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main content area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        
        <footer className="border-t py-4 text-center text-sm text-muted-foreground bg-white dark:bg-slate-900">
          © {new Date().getFullYear()} Educare. Todos os direitos reservados.
        </footer>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;
