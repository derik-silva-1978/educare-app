import React from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';

interface BreadcrumbData {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  breadcrumbs: BreadcrumbData[];
}

export const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ breadcrumbs }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          // Criar elementos separados com chaves únicas
          const items = [];
          
          // Adicionar separador apenas após o primeiro item
          if (index > 0) {
            items.push(
              <BreadcrumbSeparator 
                key={`sep-${index}`} 
                className="hidden md:block" 
              />
            );
          }
          
          // Adicionar o item de breadcrumb
          items.push(
            <BreadcrumbItem 
              key={`item-${index}-${breadcrumb.label}`}
              className={index === 0 ? "hidden md:block" : ""}
            >
              {breadcrumb.href && index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
          
          return items;
        }).flat()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
