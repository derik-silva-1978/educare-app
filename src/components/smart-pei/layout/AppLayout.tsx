
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SmartPEIHeader } from '../SmartPEIHeader';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import useAccessibility from '@/hooks/useAccessibility';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { LoadingSpinner } from '../common/LazyLoadWrapper';
import NotificationsDropdown from '../notifications/NotificationsDropdown';

// Lazy load non-critical components
const MainContent = lazy(() => import('./MainContent'));
const AccessibilityBar = lazy(() => import('./AccessibilityBar'));
const SmartPEITopNavigation = lazy(() => import('./SmartPEITopNavigation'));

export const AppLayout: React.FC = () => {
  const { toast } = useToast();
  const { announce } = useAccessibility();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboardSection');
  const { 
    isAuthenticated, 
    showUserDropdown, 
    setShowUserDropdown, 
    handleLogout 
  } = useAuth();
  
  // Track user page views for analytics
  useEffect(() => {
    const path = location.pathname;
    
    // Log page view
    const logPageView = () => {
      const pageView = {
        path,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      };
      
      // In a real app, send to analytics API
      // For now, store in localStorage
      try {
        const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
        pageViews.push(pageView);
        localStorage.setItem('pageViews', JSON.stringify(pageViews));
      } catch (error) {
        console.error('Error logging page view:', error);
      }
    };
    
    logPageView();
    
    // Set active section based on current route
    if (path.includes('dashboard')) {
      setActiveSection('dashboardSection');
    } else if (path.includes('students')) {
      setActiveSection('studentsSection');
    } else if (path.includes('assessments')) {
      setActiveSection('assessmentsSection');
    } else if (path.includes('reports')) {
      setActiveSection('reportsSection');
    }
  }, [location]);
  
  useEffect(() => {
    // Announce page load for screen readers
    announce('Aplicação Smart PEI carregada');
    
    // Welcome toast
    toast({
      title: 'Bem-vindo ao Smart PEI',
      description: 'Sistema Inteligente de Planos de Ensino Individualizado',
    });
  }, [announce, toast]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <SmartPEIHeader 
        isAuthenticated={isAuthenticated}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showUserDropdown={showUserDropdown}
        setShowUserDropdown={setShowUserDropdown}
        handleLogout={handleLogout}
        notificationsDropdown={<NotificationsDropdown />}
      />
      
      {isAuthenticated && (
        <Suspense fallback={<div className="h-12 bg-sky-800"></div>}>
          <SmartPEITopNavigation activeSection={activeSection} />
        </Suspense>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <MainContent />
        </Suspense>
      </div>
      
      <Suspense fallback={<div className="h-10 bg-gray-100"></div>}>
        <AccessibilityBar />
      </Suspense>
      <Toaster />
    </div>
  );
};

export default AppLayout;
