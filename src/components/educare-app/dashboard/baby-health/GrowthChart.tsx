import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Ruler, Scale } from 'lucide-react';
import { BiometricsData } from '@/hooks/educare-app/useBabyHealthSummary';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GrowthChartProps {
  biometrics: BiometricsData[];
  childName?: string;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ biometrics, childName }) => {
  if (biometrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Curva de Crescimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Scale className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">
              Nenhum registro de peso ou altura
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Registre o primeiro peso pelo WhatsApp para ver o grafico de crescimento!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [...biometrics]
    .reverse()
    .map(b => ({
      date: format(new Date(b.recordedAt), 'dd/MM', { locale: ptBR }),
      peso: b.weight,
      altura: b.height
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Curva de Crescimento {childName ? `- ${childName}` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Scale className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Ultimo peso</p>
              <p className="font-semibold">{biometrics[0]?.weight ? `${biometrics[0].weight} kg` : '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <Ruler className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Ultima altura</p>
              <p className="font-semibold">{biometrics[0]?.height ? `${biometrics[0].height} cm` : '-'}</p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="peso" 
              name="Peso (kg)"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              connectNulls
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="altura" 
              name="Altura (cm)"
              stroke="#22c55e" 
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
