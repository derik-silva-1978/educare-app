
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import useStudentForm from './form/useStudentForm';
import StudentFormContent from './form/StudentFormContent';
import { useFormValidation } from './form/useFormValidation';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { AutoSaveIndicator } from '@/components/ui/autosave-indicator';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StudentFormProps {
  studentId?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state management
  const { 
    formData, 
    activeTab,
    isSubmitting,
    formErrors,
    setActiveTab,
    handleChange,
    handleCheckboxArray,
    handleSubmit: submitForm,
    handleCancel,
    saveProgress
  } = useStudentForm({ studentId });
  
  const { validateForm } = useFormValidation();
  
  // Autosave settings
  const [autoSaveSettings] = useLocalStorage('student_autosave_settings', {
    enabled: true,
    interval: 30000,
    showNotifications: false
  });
  
  // Auto-save functionality - Fix the onSave function to match the expected signature
  const autoSave = useAutoSave({
    data: formData,
    onSave: async () => {
      console.log("Auto-saving student data...");
      try {
        const saved = await saveProgress();
        return saved;
      } catch (err) {
        console.error("Error auto-saving:", err);
        return false;
      }
    },
    options: {
      enabled: autoSaveSettings.enabled,
      showSuccessToast: autoSaveSettings.showNotifications,
    }
  });
  
  const handleSubmitWithValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await submitForm(e);
      toast({
        title: "Salvo com sucesso",
        description: studentId 
          ? "As informações do estudante foram atualizadas" 
          : "O novo estudante foi adicionado com sucesso"
      });
      navigate('/smart-pei/students');
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as informações do estudante",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Use a loading state from the hook or create local one
  const isLoading = false; // We'll assume form is ready
  
  if (isLoading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados do estudante...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <form onSubmit={handleSubmitWithValidation}>
        <CardContent className="p-6">
          <StudentFormContent 
            formData={formData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleChange={handleChange}
            handleCheckboxArray={handleCheckboxArray}
            formErrors={formErrors}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center">
            <AutoSaveIndicator 
              status={autoSave.status} 
              lastSavedText={autoSave.formatLastSaved() ? `às ${autoSave.formatLastSaved()}` : null}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <AlertCircle className="animate-spin h-4 w-4 mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentForm;
