
import React from 'react';
import { useChildDiary } from '@/hooks/useChildDiary';
import DiaryForm from './DiaryForm';
import DiaryEntry from './DiaryEntry';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiaryTabProps {
  childId: string;
}

export const DiaryTab: React.FC<DiaryTabProps> = ({ childId }) => {
  const { toast } = useToast();
  const {
    diaryEntries: entries,
    isLoading,
    addDiaryEntry: addEntry,
    deleteDiaryEntry: deleteEntry,
  } = useChildDiary(childId);
  
  const [showForm, setShowForm] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleAddEntry = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addEntry(data);
      setShowForm(false);
      toast({
        title: "Registro adicionado",
        description: "Seu registro foi adicionado com sucesso ao diário.",
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o registro.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteEntry(entryId);
      toast({
        title: "Registro excluído",
        description: "O registro foi removido do diário.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o registro.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Separator />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Diário de Desenvolvimento</h3>
        {!showForm && !editingEntry && (
          <Button onClick={() => setShowForm(true)} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Novo Registro
          </Button>
        )}
      </div>
      
      <Separator />
      
      {showForm && !editingEntry && (
        <Card>
          <CardContent className="p-6">
            <DiaryForm
              onSubmit={handleAddEntry}
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      )}
      
      {entries.length === 0 && !showForm ? (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Calendar className="h-12 w-12 text-blue-500 mb-2" />
            <h4 className="text-lg font-medium text-blue-800">Sem registros no diário</h4>
            <p className="text-sm text-blue-600 mt-1 mb-4 max-w-md">
              Adicione registros para acompanhar o desenvolvimento da criança, momentos especiais, 
              comportamentos, e outras observações importantes.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              Adicionar Primeiro Registro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <DiaryEntry
              key={entry.id}
              post={entry}
              onDelete={() => handleDeleteEntry(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryTab;
