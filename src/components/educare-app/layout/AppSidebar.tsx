
import React, { useState } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParentSidebar from '../sidebar/ParentSidebar';
import ProfessionalSidebar from '../sidebar/ProfessionalSidebar';
import DashboardSidebarNav from '@/components/dashboard/DashboardSidebarNav';

interface AppSidebarProps {
  className?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  const isParent = user?.role === 'parent';
  const isProfessional = user?.role === 'professional' || user?.role === 'therapist' || user?.role === 'teacher' || user?.role === 'owner' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  
  // Determine which sidebar to render based on user role
  const renderSidebar = () => {
    if (isProfessional) {
      return <ProfessionalSidebar />;
    } else if (isParent) {
      return <ParentSidebar />;
    } else {
      return (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-slate-700">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                Educare+
              </span>
            </Link>
          </div>
          
          {/* User profile info */}
          {user && (
            <div className="px-4 py-3 border-b dark:border-slate-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DashboardSidebarNav />
        </div>
      );
    }
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-30 hidden md:block ${className}`}>
        {renderSidebar()}
      </aside>
      
      {/* Mobile Sidebar Trigger */}
      <div className="fixed left-4 top-4 z-40 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white dark:bg-slate-900 shadow-md">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-white dark:bg-slate-900 border-r-0">
            {renderSidebar()}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AppSidebar;
