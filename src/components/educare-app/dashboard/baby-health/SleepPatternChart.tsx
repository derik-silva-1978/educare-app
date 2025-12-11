import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Moon, Clock, Bed } from 'lucide-react';
import { SleepLogData } from '@/hooks/educare-app/useBabyHealthSummary';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SleepPatternChartProps {
  sleepLogs: SleepLogData[];
  avgSleepPerDay: number | null;
}

export const SleepPatternChart: React.FC<SleepPatternChartProps> = ({ sleepLogs, avgSleepPerDay }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: startOfDay(date),
      dayLabel: format(date, 'EEE', { locale: ptBR }),
      fullDate: format(date, 'dd/MM'),
      totalMinutes: 0,
      hours: 0
    };
  });

  sleepLogs.forEach(log => {
    if (!log.durationMinutes) return;
    const logDate = startOfDay(new Date(log.createdAt));
    const dayData = last7Days.find(d => isSameDay(d.date, logDate));
    if (dayData) {
      dayData.totalMinutes += log.durationMinutes;
      dayData.hours = Math.round(dayData.totalMinutes / 60 * 10) / 10;
    }
  });

  const chartData = last7Days.map(d => ({
    day: d.dayLabel,
    date: d.fullDate,
    hours: d.hours
  }));

  const getBarColor = (hours: number) => {
    if (hours >= 10) return '#22c55e';
    if (hours >= 7) return '#eab308';
    return '#ef4444';
  };

  if (sleepLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            Padrao de Sono (7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bed className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">
              Nenhum registro de sono
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Registre as sonecas e noites de sono pelo WhatsApp para acompanhar o padrao!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-500" />
          Padrao de Sono (7 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg mb-4">
          <Clock className="h-5 w-5 text-indigo-500" />
          <div>
            <p className="text-xs text-muted-foreground">Media diaria</p>
            <p className="font-semibold">
              {avgSleepPerDay ? `${Math.floor(avgSleepPerDay / 60)}h ${avgSleepPerDay % 60}min` : '-'}
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} unit="h" />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-lg">
                      <p className="text-sm font-medium">{data.date}</p>
                      <p className="text-sm text-muted-foreground">{data.hours}h de sono</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.hours)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>10h+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>7-10h</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>&lt;7h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepPatternChart;
