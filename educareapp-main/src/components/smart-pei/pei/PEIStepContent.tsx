
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PEI } from '@/hooks/usePEI';
import PEIGeneralForm from './forms/PEIGeneralForm';
import PEITeamForm from './forms/PEITeamForm';
import PEIGoalsForm from './forms/PEIGoalsForm';
import PEIReviewForm from './forms/PEIReviewForm';

interface PEIStepContentProps {
  currentStep: number;
  pei: PEI;
  handlePEIUpdate: (data: any) => void;
  title: string;
  setTitle: (value: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (value: string) => void;
  startDate?: Date;
  setStartDate: (date?: Date) => void;
  endDate?: Date;
  setEndDate: (date?: Date) => void;
  nextReviewDate?: Date;
  setNextReviewDate: (date?: Date) => void;
  notes: string;
  setNotes: (value: string) => void;
  students: { id: string; name: string }[];
}

const PEIStepContent: React.FC<PEIStepContentProps> = ({
  currentStep,
  pei,
  handlePEIUpdate,
  title,
  setTitle,
  selectedStudentId,
  setSelectedStudentId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  nextReviewDate,
  setNextReviewDate,
  notes,
  setNotes,
  students
}) => {
  // Instead of using TabsContent directly, we'll use conditional rendering since
  // this component may not always be inside a Tabs component
  return (
    <>
      {currentStep === 0 && (
        <div className="block">
          <PEIGeneralForm
            title={title}
            setTitle={setTitle}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            nextReviewDate={nextReviewDate}
            setNextReviewDate={setNextReviewDate}
            notes={notes}
            setNotes={setNotes}
            students={students}
          />
        </div>
      )}
      
      {currentStep === 1 && (
        <div className="block">
          <PEITeamForm
            pei={pei}
            onUpdate={handlePEIUpdate}
          />
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="block">
          <PEIGoalsForm
            pei={pei}
            onUpdate={handlePEIUpdate}
          />
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="block">
          <PEIReviewForm
            pei={pei}
          />
        </div>
      )}
    </>
  );
};

export default PEIStepContent;
