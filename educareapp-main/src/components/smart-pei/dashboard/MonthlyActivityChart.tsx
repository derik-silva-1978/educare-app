
import React from 'react';

interface MonthlyActivityChartProps {
  data: any[];
  config: {
    assessments: { label: string; color: string };
    plans: { label: string; color: string };
  };
}

export const MonthlyActivityChart: React.FC<MonthlyActivityChartProps> = ({ data, config }) => {
  return (
    <div className="text-center p-4 text-muted-foreground">
      Este componente foi desativado durante a migração para o novo aplicativo Educare.
    </div>
  );
};

export default MonthlyActivityChart;
