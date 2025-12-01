
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileEdit, ListChecks, FileText } from 'lucide-react';

interface StudentFloatingNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  studentId: string;
}

export const StudentFloatingNavigation: React.FC<StudentFloatingNavigationProps> = ({
  activeTab,
  onTabChange,
  studentId
}) => {
  const navigate = useNavigate();
  
  const handleCreatePEI = () => {
    navigate(`/smart-pei/students/${studentId}/pei`);
  };
  
  const handleCreateAssessment = () => {
    navigate(`/smart-pei/assessments`, { state: { studentId } });
  };
  
  const handleViewAllPEIs = () => {
    onTabChange('pei');
  };
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2">
      <Button 
        size="sm" 
        className="rounded-full h-12 w-12 shadow-lg p-0"
        variant={activeTab === 'pei' ? 'default' : 'secondary'}
        onClick={handleViewAllPEIs}
        title="Ver PEIs"
      >
        <ListChecks className="h-5 w-5" />
      </Button>
      
      <Button 
        size="sm" 
        className="rounded-full h-12 w-12 shadow-lg p-0"
        onClick={handleCreatePEI}
        title="Criar novo PEI"
      >
        <FileEdit className="h-5 w-5" />
      </Button>
      
      <Button 
        size="sm" 
        className="rounded-full h-12 w-12 shadow-lg p-0"
        variant="outline"
        onClick={handleCreateAssessment}
        title="Nova avaliação"
      >
        <FileText className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default StudentFloatingNavigation;
