
import { Link } from 'react-router-dom';
import DashboardSidebarNav from './DashboardSidebarNav';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const DashboardSidebar = () => {
  const { user } = useAuth();
  
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border shadow-sm z-30 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl bg-gradient-to-r from-educare-600 to-educare-400 bg-clip-text text-transparent">
              Educare+
            </span>
          </Link>
        </div>
        
        {/* User profile info */}
        {user && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">{user.name || user.email}</p>
                <p className="text-xs text-gray-500 truncate">{user.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation links based on user role */}
        <DashboardSidebarNav />
      </div>
    </aside>
  );
};

export default DashboardSidebar;
