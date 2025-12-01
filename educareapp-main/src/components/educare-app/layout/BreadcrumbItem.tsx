import React from 'react';
import { BreadcrumbItem as UIBreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isFirst: boolean;
  isLast: boolean;
}

export const CustomBreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ 
  label, 
  href, 
  isFirst,
  isLast
}) => {
  return (
    <UIBreadcrumbItem className={isFirst ? "hidden md:block" : ""}>
      {href && !isLast ? (
        <BreadcrumbLink href={href}>
          {label}
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage>{label}</BreadcrumbPage>
      )}
    </UIBreadcrumbItem>
  );
};
