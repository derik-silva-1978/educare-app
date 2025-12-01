
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Info, Heart, Pill, FileText, TrendingUp } from 'lucide-react';
import { HealthRecord } from '@/types/health-measurements';

interface HealthRecordsListProps {
  records: HealthRecord[];
  title?: string;
  maxItems?: number;
  filterType?: string;
  emptyMessage?: string;
}

const getRecordIcon = (type: string) => {
  switch (type) {
    case 'vaccination': return Heart;
    case 'medication': return Pill;
    case 'exam': return FileText;
    case 'growth': return TrendingUp;
    default: return Activity;
  }
};

const getRecordColor = (type: string) => {
  switch (type) {
    case 'vaccination': return 'text-red-500';
    case 'medication': return 'text-blue-500';
    case 'exam': return 'text-purple-500';
    case 'growth': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

const getRecordBadgeVariant = (type: string) => {
  switch (type) {
    case 'vaccination': return 'destructive';
    case 'medication': return 'default';
    case 'exam': return 'secondary';
    case 'growth': return 'outline';
    default: return 'outline';
  }
};

export const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  records,
  title = "Registros",
  maxItems = 3,
  filterType,
  emptyMessage = "Nenhum registro encontrado"
}) => {
  const filteredRecords = filterType 
    ? records.filter(record => record.record_type === filterType)
    : records;

  const displayRecords = filteredRecords.slice(0, maxItems);

  if (filteredRecords.length === 0) {
    return (
      <Alert className="border-dashed border-2">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-center py-4">
          {emptyMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {title} ({filteredRecords.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayRecords.map((record, index) => {
            const IconComponent = getRecordIcon(record.record_type);
            const iconColor = getRecordColor(record.record_type);
            const badgeVariant = getRecordBadgeVariant(record.record_type);
            
            return (
              <div key={record.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className={`p-2 rounded-full bg-muted/50 ${iconColor}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{record.name}</p>
                    <Badge variant={badgeVariant as any} className="text-xs">
                      {record.record_type === 'vaccination' && 'Vacina'}
                      {record.record_type === 'medication' && 'Medicamento'}
                      {record.record_type === 'exam' && 'Exame'}
                      {record.record_type === 'growth' && 'Crescimento'}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {new Date(record.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  
                  {record.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{record.description}</p>
                  )}
                  
                  {/* Growth-specific measurements */}
                  {record.record_type === 'growth' && (
                    <div className="flex gap-3 mt-2">
                      {record.height && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {record.height}cm
                        </span>
                      )}
                      {record.weight && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {record.weight}kg
                        </span>
                      )}
                      {record.temperature && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {record.temperature}°C
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredRecords.length > maxItems && (
          <div className="p-4 bg-muted/20 text-center">
            <p className="text-sm text-muted-foreground">
              +{filteredRecords.length - maxItems} registro(s) adicional(is)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
