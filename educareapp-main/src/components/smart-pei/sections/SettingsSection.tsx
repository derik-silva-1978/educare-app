
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const SettingsSection: React.FC = () => {
  return (
    <div className="settings-section">
      <h2 className="text-2xl font-bold mb-6">Configurações</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Modo Escuro</Label>
              <Switch id="darkMode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailAlerts">Alertas por Email</Label>
              <Switch id="emailAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">Alterar Senha</Button>
            <Button variant="outline" className="w-full">Editar Perfil</Button>
            <Separator className="my-2" />
            <Button variant="destructive" className="w-full">Excluir Conta</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsSection;
