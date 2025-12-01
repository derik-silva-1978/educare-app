
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PEIProgress } from '@/hooks/usePEI';
import { format, differenceInDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ChartLine } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TimelinePoint } from './timeline/TimelinePoint';
import { RecordDetails } from './timeline/RecordDetails';
import { getProgressValue } from './timeline/timelineUtils';

interface ProgressTimelineProps {
  progressRecords: PEIProgress[];
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ progressRecords }) => {
  const [hoveredRecord, setHoveredRecord] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  if (progressRecords.length <= 1) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            É necessário ter pelo menos dois registros de progresso para visualizar a linha do tempo.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort progress records by date (oldest to newest)
  const sortedRecords = [...progressRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate total days between first and last record
  const totalDays = differenceInDays(
    new Date(sortedRecords[sortedRecords.length - 1].date),
    new Date(sortedRecords[0].date)
  ) || 1; // Avoid division by zero

  const handlePointClick = (recordId: string) => {
    setSelectedRecord(prevId => prevId === recordId ? null : recordId);
  };

  return (
    <TooltipProvider>
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <ChartLine className="h-4 w-4 text-primary" />
            Linha do Tempo de Progresso
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="relative pt-6 pb-2">
            {/* Timeline track with animated progress */}
            <div className="absolute h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-primary rounded-full transition-all duration-700" 
                style={{ 
                  width: `${getProgressValue(sortedRecords[sortedRecords.length - 1].status)}%` 
                }} 
              />
            </div>
            
            {/* Timeline points */}
            <div className="relative flex justify-between items-center h-16">
              {sortedRecords.map((record, index) => {
                // Calculate position based on days from start (for more accurate spacing)
                const daysSinceStart = differenceInDays(
                  new Date(record.date), new Date(sortedRecords[0].date)
                );
                const position = totalDays === 0 
                  ? index * (100 / (sortedRecords.length - 1)) 
                  : (daysSinceStart / totalDays) * 100;
                
                return (
                  <TimelinePoint
                    key={record.id}
                    record={record}
                    position={position}
                    isSelected={selectedRecord === record.id}
                    isHovered={hoveredRecord === record.id}
                    onClick={handlePointClick}
                    onHover={setHoveredRecord}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Selected record details */}
          {selectedRecord && (
            <div className="mt-8 pt-3 border-t border-border/30 animate-fade-in">
              {sortedRecords.map(record => {
                if (record.id === selectedRecord) {
                  return <RecordDetails key={record.id} record={record} />;
                }
                return null;
              })}
            </div>
          )}
          
          {!selectedRecord && (
            <div className="flex justify-between text-xs text-muted-foreground mt-8">
              <div>Início: {format(new Date(sortedRecords[0].date), 'PP', { locale: pt })}</div>
              <div>
                Última atualização: {format(new Date(sortedRecords[sortedRecords.length - 1].date), 'PP', { locale: pt })}
              </div>
            </div>
          )}
          
          {!selectedRecord && (
            <div className="mt-3 text-center text-xs text-muted-foreground">
              Clique em qualquer ponto da linha do tempo para ver os detalhes
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProgressTimeline;
