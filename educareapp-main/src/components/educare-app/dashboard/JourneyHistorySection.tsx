import React from 'react';
import KPICards from './KPICards';

export const JourneyHistorySection: React.FC<{ childId?: string; userRole?: 'parent' | 'professional'; }> = ({ 
  childId,
  userRole = 'parent'
}) => {
  // Placeholders for props/data. Normally, fetch real data by childId.
  // For demo: add "Completed", "In Progress", "Pending" breakdown.
  const journeyData = {
    completed: 2,
    inProgress: 1,
    pending: 3,
    history: [
      { date: '2024-03-10', status: 'Concluído', summary: 'Jornada completa' },
      { date: '2024-02-10', status: 'Em Progresso', summary: 'Marcos em andamento' },
      { date: '2024-01-20', status: 'Pendente', summary: 'Aguardando início' },
    ]
  };

  return (
    <div>
      {/* New: Use KPI Cards for breakdown */}
      <div className="mb-6">
        <KPICards 
          inProgress={journeyData.inProgress} 
          completed={journeyData.completed} 
          pending={journeyData.pending} 
        />
      </div>
      <div className="mb-4 font-semibold text-primary">Histórico de Jornadas</div>
      <div className="bg-white rounded-md shadow-sm divide-y">
        {journeyData.history.map((h, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{h.date}</div>
              <div className="text-muted-foreground text-sm">{h.summary}</div>
            </div>
            <div 
              className={
                h.status === 'Concluído'
                  ? 'text-green-600 font-semibold'
                  : h.status === 'Em Progresso'
                  ? 'text-blue-600 font-semibold'
                  : 'text-amber-600 font-semibold'
              }
            >{h.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyHistorySection;
