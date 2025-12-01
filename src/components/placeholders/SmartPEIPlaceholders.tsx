
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BarChart } from 'lucide-react';

interface PlaceholderProps {
  title?: string;
  description?: string;
  [key: string]: any; // Allow for any additional props
}

export const Placeholder: React.FC<PlaceholderProps> = ({ 
  title = "Component Not Implemented", 
  description = "This component has not been implemented yet.",
  ...props 
}) => {
  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-gray-500">{description}</p>
      {Object.keys(props).length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400">Props received:</p>
          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-24">
            {JSON.stringify(props, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Additional placeholders needed by other components
export const PEIProgressPlaceholder: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Progresso da Jornada Educare
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-12 text-center">
          <div className="max-w-md space-y-4">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-medium">Dados não disponíveis</h3>
            <p className="text-muted-foreground">
              Não foi possível carregar o progresso da jornada. 
              Por favor, inicie uma avaliação ou tente novamente mais tarde.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SmartPEIPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <PEIProgressPlaceholder />
    </div>
  );
};

export const UserManagement: React.FC = () => {
  return <Placeholder title="User Management" description="User management functionality is not implemented yet." />;
};

export const UserRoleGuard: React.FC<{ roles: string[], children: React.ReactNode }> = ({ roles, children }) => {
  // In a real implementation, this would check user roles
  return <>{children}</>;
};

export const LicenseMigrationTool: React.FC = () => {
  return <Placeholder title="License Migration Tool" description="License migration tool is not implemented yet." />;
};

export const BulkLicenseCreator: React.FC = () => {
  return <Placeholder title="Bulk License Creator" description="Bulk license creator is not implemented yet." />;
};
