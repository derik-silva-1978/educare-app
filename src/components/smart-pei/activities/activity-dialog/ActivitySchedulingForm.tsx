import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActivityFormData } from '@/types/activity';

interface ActivitySchedulingFormProps {
  formData: ActivityFormData;
  handleInputChange: (field: keyof ActivityFormData, value: any) => void;
  handleDateChange: (field: 'startDate' | 'endDate', date: Date) => void;
  handleTimeChange: (field: 'startTime' | 'endTime', value: string) => void;
  handleAllDayToggle: (checked: boolean) => void;
  handleRecurringToggle: (checked: boolean) => void;
  startTime: string;
  endTime: string;
}

const ActivitySchedulingForm: React.FC<ActivitySchedulingFormProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  handleTimeChange,
  handleAllDayToggle,
  handleRecurringToggle,
  startTime,
  endTime
}) => {
  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Switch 
          id="allDay" 
          checked={formData.allDay} 
          onCheckedChange={handleAllDayToggle}
        />
        <Label htmlFor="allDay">Dia inteiro</Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de início</Label>
          <DatePicker 
            date={formData.startDate} 
            onSelect={(date) => date && handleDateChange('startDate', date)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Data de término</Label>
          <DatePicker 
            date={formData.endDate || formData.startDate} 
            onSelect={(date) => date && handleDateChange('endDate', date)}
          />
        </div>
      </div>
      
      {!formData.allDay && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Hora de início</Label>
            <Input 
              id="startTime" 
              type="time" 
              value={startTime} 
              onChange={(e) => handleTimeChange('startTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">Hora de término</Label>
            <Input 
              id="endTime" 
              type="time" 
              value={endTime} 
              onChange={(e) => handleTimeChange('endTime', e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2 mt-4">
        <Switch 
          id="recurring" 
          checked={formData.isRecurring} 
          onCheckedChange={handleRecurringToggle}
        />
        <Label htmlFor="recurring">Atividade recorrente</Label>
      </div>
      
      {formData.isRecurring && formData.recurrencePattern && (
        <RecurrenceOptions
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
};

interface RecurrenceOptionsProps {
  formData: ActivityFormData;
  handleInputChange: (field: keyof ActivityFormData, value: any) => void;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4 mt-2 p-4 border rounded-md">
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequência</Label>
        <Select 
          value={formData.recurrencePattern?.frequency || "weekly"} 
          onValueChange={(value) => {
            handleInputChange('recurrencePattern', {
              ...formData.recurrencePattern!,
              frequency: value as any
            });
          }}
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Selecione a frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diária</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="interval">Intervalo</Label>
        <Select 
          value={formData.recurrencePattern?.interval.toString() || "1"} 
          onValueChange={(value) => {
            handleInputChange('recurrencePattern', {
              ...formData.recurrencePattern!,
              interval: parseInt(value)
            });
          }}
        >
          <SelectTrigger id="interval">
            <SelectValue placeholder="Selecione o intervalo" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((i) => (
              <SelectItem key={i} value={i.toString()}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ActivitySchedulingForm;
