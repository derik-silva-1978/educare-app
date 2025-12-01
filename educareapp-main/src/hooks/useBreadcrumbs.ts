
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  
  return useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Base breadcrumb for all educare-app routes
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Educare', href: '/educare-app/dashboard' }
    ];
    
    // Map route segments to readable labels
    const routeLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'children': 'Crianças',
      'journey-bot': 'TitiNauta',
      'activities': 'Atividades',
      'settings': 'Configurações',
      'professional': 'Profissional',
      'child-analysis': 'Análise da Criança'
    };
    
    // Handle educare-app routes
    if (pathSegments[0] === 'educare-app' && pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1];
      const pageLabel = routeLabels[currentPage] || currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
      
      // Don't add breadcrumb if we're on dashboard (it's already the base)
      if (currentPage !== 'dashboard') {
        breadcrumbs.push({ label: pageLabel });
      }
    }
    
    return breadcrumbs;
  }, [location.pathname]);
};
