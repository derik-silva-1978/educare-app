
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
        <h3 className="text-lg font-semibold mb-1">Anamnese</h3>
        <p className="text-muted-foreground text-sm">
          Registro de informações importantes sobre gestação, parto e primeiros dias de vida da criança.
        </p>
      </div>
      
      {!anamneseData && (
        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informações não registradas</AlertTitle>
          <AlertDescription>
            Preencha o formulário abaixo para registrar os dados de anamnese da criança. 
            Essas informações são importantes para o acompanhamento do desenvolvimento.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <AnamneseForm 
            childId={childId}
            existingData={anamneseData}
            onSubmit={handleSaveAnamnese}
            onCancel={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnamneseTab;
