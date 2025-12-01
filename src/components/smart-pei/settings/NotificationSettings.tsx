
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BellIcon, BellOffIcon, MessageSquare, FilePlus2, UserPlus2, Clock, Calendar } from 'lucide-react';

interface NotificationSettingsProps {
  onSave: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assessmentReminders: true,
    peiReviewReminders: true,
    studentProgress: true,
    comments: true,
    newStudents: false,
    reminderFrequency: 'daily',
    summaryFrequency: 'weekly'
  });
  
  const handleToggle = (field: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving notification settings:', notificationSettings);
    onSave();
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Preferências de Notificações</CardTitle>
          <CardDescription>
            Gerencie como e quando você recebe notificações
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Canais de Notificação</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications">Notificações por email</Label>
              </div>
              <Switch 
                id="email-notifications" 
                checked={notificationSettings.emailNotifications} 
                onCheckedChange={() => handleToggle('emailNotifications')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-notifications">Notificações no sistema</Label>
              </div>
              <Switch 
                id="push-notifications" 
                checked={notificationSettings.pushNotifications} 
                onCheckedChange={() => handleToggle('pushNotifications')} 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tipos de Notificação</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FilePlus2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="assessment-reminders">Lembretes de avaliação</Label>
              </div>
              <Switch 
                id="assessment-reminders" 
                checked={notificationSettings.assessmentReminders} 
                onCheckedChange={() => handleToggle('assessmentReminders')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="pei-review-reminders">Lembretes de revisão de PEI</Label>
              </div>
              <Switch 
                id="pei-review-reminders" 
                checked={notificationSettings.peiReviewReminders} 
                onCheckedChange={() => handleToggle('peiReviewReminders')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="new-students">Novos alunos</Label>
              </div>
              <Switch 
                id="new-students" 
                checked={notificationSettings.newStudents} 
                onCheckedChange={() => handleToggle('newStudents')} 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Frequência</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Frequência de lembretes</Label>
                <Select
                  value={notificationSettings.reminderFrequency}
                  onValueChange={(value) => handleSelectChange('reminderFrequency', value)}
                >
                  <SelectTrigger id="reminder-frequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="monthly">Mensalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary-frequency">Resumos de atividade</Label>
                <Select
                  value={notificationSettings.summaryFrequency}
                  onValueChange={(value) => handleSelectChange('summaryFrequency', value)}
                >
                  <SelectTrigger id="summary-frequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="monthly">Mensalmente</SelectItem>
                    <SelectItem value="never">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setNotificationSettings({
                emailNotifications: false,
                pushNotifications: false,
                assessmentReminders: false,
                peiReviewReminders: false,
                studentProgress: false,
                comments: false,
                newStudents: false,
                reminderFrequency: 'weekly',
                summaryFrequency: 'never'
              });
            }}
            className="flex items-center gap-2"
          >
            <BellOffIcon className="h-4 w-4" />
            Desativar tudo
          </Button>
          <Button type="submit">
            Salvar alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NotificationSettings;
