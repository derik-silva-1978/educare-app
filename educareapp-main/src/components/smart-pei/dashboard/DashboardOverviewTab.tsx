
import React from 'react';
import ChartContainer from './ChartContainer';
import { DomainProgressAnalytics } from './DomainProgressAnalytics';
import { DevelopmentProgressChart } from './DevelopmentProgressChart';
import { MonthlyActivityChart } from './MonthlyActivityChart';
import { AssessmentCompletionChart } from './AssessmentCompletionChart';

interface DashboardOverviewTabProps {
  domainProgressData: any[];
  developmentProgressData: any[];
  monthlyActivityData: any[];
  activityConfig: {
    assessments: { label: string; color: string };
    plans: { label: string; color: string };
  };
  assessmentCompletionData: any[];
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  domainProgressData,
  developmentProgressData,
  monthlyActivityData,
  activityConfig,
  assessmentCompletionData
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DomainProgressAnalytics data={domainProgressData} />
        
        <ChartContainer title="Progresso do Desenvolvimento" id="dev-progress">
          <DevelopmentProgressChart data={developmentProgressData} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Atividade Mensal" id="monthly-activity">
          <MonthlyActivityChart data={monthlyActivityData} config={activityConfig} />
        </ChartContainer>
        
        <ChartContainer title="Conclusão de Avaliações" id="assessment-completion">
          <AssessmentCompletionChart data={assessmentCompletionData} />
        </ChartContainer>
      </div>
    </>
  );
};

export default DashboardOverviewTab;
