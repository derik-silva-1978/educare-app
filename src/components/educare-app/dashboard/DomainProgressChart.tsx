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

const sampleData: DomainData[] = [
  { domain: 'Motor', shortName: 'Motor', progress: 75, color: '#3B82F6' },
  { domain: 'Linguagem', shortName: 'Linguagem', progress: 62, color: '#10B981' },
  { domain: 'Cognitivo', shortName: 'Cognitivo', progress: 88, color: '#F59E0B' },
  { domain: 'Social', shortName: 'Social', progress: 54, color: '#8B5CF6' },
  { domain: 'Sensorial', shortName: 'Sensorial', progress: 70, color: '#EC4899' },
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
  data,
  childName 
}) => {
  const chartData = data && data.some(d => d.progress > 0) ? data : sampleData;

  return (
    <Card className="h-full">
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="shortName" 
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="progress" 
                radius={[0, 6, 6, 0]}
                maxBarSize={28}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="progress" 
                  position="right" 
                  formatter={(v: number) => `${v}%`}
                  className="text-xs"
                  style={{ fill: '#6B7280', fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {(!data || !data.some(d => d.progress > 0)) && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            * Dados de exemplo. Complete a jornada para ver seu progresso real.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainProgressChart;
