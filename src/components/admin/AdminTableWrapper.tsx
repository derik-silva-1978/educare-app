import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminTableWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminTableWrapper({
  title,
  description,
  children,
  actions
}: AdminTableWrapperProps) {
  return (
    <Card>
      {(title || description || actions) && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto -mx-6">
          <div className="min-w-full inline-block align-middle px-6">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminTableWrapper;
