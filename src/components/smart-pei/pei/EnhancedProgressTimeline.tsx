
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PEIProgress } from '@/hooks/usePEI';
import { format, differenceInDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ChartLine } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TimelinePoint } from './timeline/TimelinePoint';
import { RecordDetails } from './timeline/RecordDetails';
import { 
  getProgressValue, 
  getTrendIcon, 
  getTrendMessage
} from './timeline/timelineUtils';

interface EnhancedProgressTimelineProps {
  progressRecords: PEIProgress[];
  compact?: boolean;
}

export const EnhancedProgressTimeline: React.FC<EnhancedProgressTimelineProps> = ({ 
  progressRecords,
  compact = false
}) => {
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

  // Calculate overall trend
  const firstValue = getProgressValue(sortedRecords[0].status);
  const lastValue = getProgressValue(sortedRecords[sortedRecords.length - 1].status);
  const trend = lastValue > firstValue ? 'positive' : lastValue < firstValue ? 'negative' : 'neutral';

  // Handle record selection with animation
  const handleRecordSelect = (id: string) => {
    // If the same record is clicked, deselect it
    if (selectedRecord === id) {
      setSelectedRecord(null);
    } else {
      setSelectedRecord(id);
    }
  };

  return (
    <TooltipProvider>
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <ChartLine className="h-4 w-4 text-primary" />
              Linha do Tempo de Progresso
            </CardTitle>
            
            <div className="flex items-center gap-1.5 text-xs">
              {getTrendIcon(trend)}
              <span className="animate-fade-in">{getTrendMessage(trend)}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="relative pt-6 pb-2" role="region" aria-label="Linha do tempo de progresso">
            {/* Timeline track */}
            <div className="absolute h-1.5 w-full bg-muted rounded-full" aria-hidden="true" />
            
            {/* Timeline points */}
            <div className="relative flex justify-between items-center h-12">
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
                    onClick={handleRecordSelect}
                    onHover={setHoveredRecord}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Selected record details with animation */}
          {selectedRecord && (
            <div className="mt-10 pt-3 border-t border-border/30 animate-fade-in" 
                 role="region" 
                 aria-label="Detalhes do registro de progresso selecionado">
              {sortedRecords.map(record => {
                if (record.id === selectedRecord) {
                  return <RecordDetails key={record.id} record={record} />;
                }
                return null;
              })}
            </div>
          )}
          
          {!selectedRecord && (
            <div className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground mt-10 animate-fade-in gap-2 sm:gap-0">
              <div>Início: {format(new Date(sortedRecords[0].date), 'PP', { locale: pt })}</div>
              <div>Última: {format(new Date(sortedRecords[sortedRecords.length - 1].date), 'PP', { locale: pt })}</div>
            </div>
          )}
          
          {!compact && !selectedRecord && (
            <div className="mt-3 text-center text-xs text-muted-foreground transition-opacity duration-300 hover:opacity-80">
              Clique em qualquer ponto da linha do tempo para ver os detalhes
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedProgressTimeline;
