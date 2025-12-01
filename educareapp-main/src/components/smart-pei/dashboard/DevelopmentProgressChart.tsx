
import React from 'react';

interface DevelopmentProgressChartProps {
  data: any[];
}

export const DevelopmentProgressChart: React.FC<DevelopmentProgressChartProps> = ({ data }) => {
  return (
    <div className="text-center p-4 text-muted-foreground">
      Este componente foi desativado durante a migração para o novo aplicativo Educare.
    </div>
  );
};

export default DevelopmentProgressChart;
