import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DomainData {
  domain: string;
  shortName: string;
  progress: number;
  color: string;
}

interface DomainProgressChartProps {
  data?: DomainData[];
  childName?: string;
}

const defaultData: DomainData[] = [
  { domain: 'Motor', shortName: 'Motor', progress: 0, color: '#3B82F6' },
  { domain: 'Linguagem', shortName: 'Linguagem', progress: 0, color: '#10B981' },
  { domain: 'Cognitivo', shortName: 'Cognitivo', progress: 0, color: '#F59E0B' },
  { domain: 'Social', shortName: 'Social', progress: 0, color: '#8B5CF6' },
  { domain: 'Sensorial', shortName: 'Sensorial', progress: 0, color: '#EC4899' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-sm">{data.domain}</p>
        <p className="text-sm text-muted-foreground">
          Progresso: <span className="font-medium text-primary">{data.progress}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const DomainProgressChart: React.FC<DomainProgressChartProps> = ({ 
  data = defaultData,
  childName 
}) => {
  const hasData = data.some(d => d.progress > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Progresso por Domínio
            {childName && (
              <span className="text-sm font-normal text-muted-foreground ml-1">
                - {childName}
              </span>
            )}
          </CardTitle>
          <UITooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Acompanhe o progresso do desenvolvimento em cada domínio baseado nas respostas da jornada.</p>
            </TooltipContent>
          </UITooltip>
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis 
                  type="category" 
                  dataKey="shortName" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="progress" 
                  radius={[0, 4, 4, 0]}
                  maxBarSize={30}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="progress" 
                    position="right" 
                    formatter={(v: number) => `${v}%`}
                    className="text-xs fill-muted-foreground"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground text-sm">
                Complete a jornada para ver o progresso por domínio
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainProgressChart;
