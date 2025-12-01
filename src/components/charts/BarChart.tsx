
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: Array<{ name: string; valor: number; color?: string }>;
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const getStatusText = (percentage: number) => {
      if (percentage >= 80) return 'Excelente';
      if (percentage >= 60) return 'Bom';
      return 'Atenção necessária';
    };

    return (
      <div className="bg-card/95 border border-border/50 rounded-lg shadow-sm p-2 backdrop-blur-sm">
        <p className="text-xs font-medium text-card-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{value}%</span>
        </p>
        <div className={`text-xs font-medium ${
          value >= 80 ? 'text-emerald-600' : 
          value >= 60 ? 'text-amber-600' : 'text-red-600'
        }`}>
          {getStatusText(value)}
        </div>
      </div>
    );
  }
  return null;
};

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  color = "hsl(var(--primary))" 
}) => {
  // Cores por dimensão usando tokens do sistema
  const dimensionColors = [
    'hsl(var(--chart-1))', // Motor Grosso
    'hsl(var(--chart-2))', // Motor Fino  
    'hsl(var(--chart-3))', // Linguagem
    'hsl(var(--chart-4))', // Cognitivo
    'hsl(var(--chart-5))', // Social/Emocional
    'hsl(var(--primary))'   // Autocuidado
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
        barSize={20}
      >
        <defs>
          {dimensionColors.map((color, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.7}/>
              <stop offset="100%" stopColor={color} stopOpacity={0.5}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid 
          strokeDasharray="2 2" 
          vertical={false} 
          stroke="hsl(var(--border))"
          strokeOpacity={0.3}
        />
        <XAxis 
          dataKey="name" 
          scale="point" 
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          domain={[0, 100]} 
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="valor" 
          radius={[4, 4, 0, 0]}
          stroke="hsl(var(--border))"
          strokeWidth={0.5}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#gradient-${index % dimensionColors.length})`}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
