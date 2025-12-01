import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PEICreator from '@/components/smart-pei/pei/PEICreator';
import { PEIViewer } from '@/components/smart-pei/pei/PEIViewer';
import { PEISelector } from '@/components/smart-pei/pei/PEISelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePEI } from '@/hooks/usePEI';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { TitibotProvider } from '@/components/smart-pei/titibot/TitibotProvider';

const PEIPage: React.FC = () => {
  const { id: studentId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getStudentPEIs } = usePEI();
  const { toast } = useToast();
  
  const [activePEI, setActivePEI] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [peiList, setPeiList] = useState<any[]>([]);
  
  const assessmentId = location.state?.assessmentId;
  
  useEffect(() => {
    if (assessmentId) {
      setActiveTab('create');
    }
  }, [assessmentId]);
  
  useEffect(() => {
    if (studentId) {
      setIsLoading(true);
      try {
        const studentPEIs = getStudentPEIs(studentId);
        setPeiList(studentPEIs);
      } catch (error) {
        console.error('Error loading PEIs:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os PEIs do estudante',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [studentId, getStudentPEIs]);
  
  const handleSelectPEI = (peiId: string) => {
    setActivePEI(peiId);
    setActiveTab('view');
  };
  
  const handleBackToProfile = () => {
    navigate(`/smart-pei/students/${studentId}`);
  };
  
  const handlePEICreated = (peiId: string) => {
    toast({
      title: 'PEI Criado',
      description: 'O Plano Educacional Individualizado foi criado com sucesso.',
      variant: 'default'
    });
    
    if (studentId) {
      const refreshedList = getStudentPEIs(studentId);
      setPeiList(refreshedList);
    }
    
    setActivePEI(peiId);
    setActiveTab('view');
  };
  
  return (
    <TitibotProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBackToProfile}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Perfil
          </Button>
          <h1 className="text-2xl font-bold">Plano Educacional Individualizado</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="list">
                <FileText className="mr-2 h-4 w-4" />
                Lista de PEIs
              </TabsTrigger>
              {activePEI && (
                <TabsTrigger value="view">
                  <FileText className="mr-2 h-4 w-4" />
                  Visualizar PEI
                </TabsTrigger>
              )}
              <TabsTrigger value="create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo PEI
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="list" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PEISelector 
                studentId={studentId || ''} 
                onSelectPEI={handleSelectPEI} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="view" className="mt-0">
            {activePEI ? (
              <PEIViewer />
            ) : (
              <div className="p-8 text-center">
                <p>Selecione um PEI da lista para visualizar</p>
                <Button variant="outline" onClick={() => setActiveTab('list')} className="mt-4">
                  Ver Lista de PEIs
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="mt-0">
            <PEICreator 
              studentId={studentId || ''} 
              assessmentId={assessmentId} 
              onCreated={handlePEICreated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </TitibotProvider>
  );
};

export default PEIPage;
