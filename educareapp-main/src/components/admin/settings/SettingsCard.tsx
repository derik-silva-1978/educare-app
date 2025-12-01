
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { SaveButton } from '@/components/ui/save-button';

type SettingsCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onSave: () => void;
  isLoading: boolean;
};

export const SettingsCard = ({
  title,
  description,
  icon,
  children,
  onSave,
  isLoading,
}: SettingsCardProps) => {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-white border-b pb-4">
        {icon ? (
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-slate-900">{title}</CardTitle>
          </div>
        ) : (
          <CardTitle className="text-slate-900">{title}</CardTitle>
        )}
        <CardDescription className="text-slate-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="space-y-6 text-slate-800">
          {children}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4 bg-slate-50">
        <SaveButton 
          onClick={onSave} 
          isLoading={isLoading} 
          text="Salvar Configurações" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </CardFooter>
    </Card>
  );
};
