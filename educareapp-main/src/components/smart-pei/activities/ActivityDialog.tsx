
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from '@/types/activity';
import ActivityBasicForm from './activity-dialog/ActivityBasicForm';
import ActivitySchedulingForm from './activity-dialog/ActivitySchedulingForm';
import ActivityDetailsForm from './activity-dialog/ActivityDetailsForm';
import { useActivityForm } from '@/hooks/useActivityForm';

interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
  activity?: Activity; // If provided, we're editing an existing activity
}

export const ActivityDialog: React.FC<ActivityDialogProps> = ({ 
  open, 
  onClose,
  activity 
}) => {
  const isEditMode = !!activity;
  const { 
    formData,
    handleInputChange,
    handleSubmit,
    handleDateChange,
    handleTimeChange,
    handleAllDayToggle,
    handleRecurringToggle,
    startTime,
    endTime,
    activeTab,
    setActiveTab
  } = useActivityForm(activity, onClose);

  // Create adapter functions to match expected types
  const adaptedHandleDateChange = (field: "startDate" | "endDate", date: Date) => {
    const type = field === "startDate" ? "start" : "end";
    handleDateChange(type, date);
  };

  const adaptedHandleTimeChange = (field: "startTime" | "endTime", value: string) => {
    const type = field === "startTime" ? "start" : "end";
    handleTimeChange(type, value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Atividade' : 'Nova Atividade'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Edite os detalhes da atividade existente.' 
              : 'Preencha os detalhes para criar uma nova atividade.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={(e) => {
          handleSubmit(e);
        }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-0">
              <ActivityBasicForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
              />
            </TabsContent>
            
            <TabsContent value="scheduling" className="space-y-4 mt-0">
              <ActivitySchedulingForm 
                formData={formData}
                handleInputChange={handleInputChange}
                handleDateChange={adaptedHandleDateChange}
                handleTimeChange={adaptedHandleTimeChange}
                handleAllDayToggle={handleAllDayToggle}
                handleRecurringToggle={handleRecurringToggle}
                startTime={startTime}
                endTime={endTime}
              />
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 mt-0">
              <ActivityDetailsForm 
                formData={formData} 
                handleInputChange={handleInputChange}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? 'Salvar alterações' : 'Criar atividade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
