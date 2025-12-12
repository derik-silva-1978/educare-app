
import React from 'react';
import { useChildAnamnese } from '@/hooks/useChildAnamnese';
import { AnamneseForm } from './anamnese/AnamneseForm';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirm } from '@/hooks/useConfirm';
import { AnamneseFormData } from '@/types/anamneseTypes';

interface AnamneseTabProps {
  childId: string;
}

export const AnamneseTab: React.FC<AnamneseTabProps> = ({ childId }) => {
  const { 
    anamneseData, 
    isLoading, 
    isSaving,
    isDeleting,
    saveAnamnese,
    deleteAnamnese
  } = useChildAnamnese(childId);
  
  const { confirm } = useConfirm();
  
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Excluir anamnese",
      description: "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar"
    });
    
    if (confirmed) {
      deleteAnamnese();
    }
  };

  const handleSaveAnamnese = (data: AnamneseFormData) => {
    saveAnamnese({ formData: data });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-[300px]" />
          <Skeleton className="h-4 w-full max-w-[250px]" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
          </div>
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          Anamnese
          <span className="ml-2 inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
            Em Desenvolvimento
          </span>
        </h3>
        <p className="text-muted-foreground text-sm">
          Registro de informações importantes sobre gestação, parto e primeiros dias de vida da criança.
        </p>
      </div>
      
      <Alert className="bg-amber-50 border-amber-200 text-amber-900">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funcionalidade em desenvolvimento</AlertTitle>
        <AlertDescription>
          Esta seção está sendo aprimorada e ainda não está disponível para uso. 
          Voltaremos em breve com a funcionalidade completa.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AnamneseTab;
