
import React from 'react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ChartDataPoint } from './utils';

// Colors for pie/radar charts
const COLORS = ['#10b981', '#3b82f6', '#6b7280', '#ef4444', '#f97316'];

interface CartesianChartProps {
  data: ChartDataPoint[];
  chartColor: { stroke: string; fill: string };
}

export const AreaChartComponent: React.FC<CartesianChartProps> = ({ data, chartColor }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={data}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={chartColor.fill} stopOpacity={0.3} />
          <stop offset="95%" stopColor={chartColor.fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis 
        dataKey="date" 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
        domain={[0, 100]}
        tickCount={5}
      />
      <Tooltip
        formatter={(value: number) => [`${value}%`, 'Progresso']}
        labelFormatter={(label) => {
          const item = data.find(item => item.date === label);
          return item ? item.fullDate : label;
        }}
      />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke={chartColor.stroke} 
        fillOpacity={1}
        fill="url(#colorValue)"
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const LineChartComponent: React.FC<CartesianChartProps> = ({ data, chartColor }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={data}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis 
        dataKey="date" 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
        domain={[0, 100]}
        tickCount={5}
      />
      <Tooltip
        formatter={(value: number) => [`${value}%`, 'Progresso']}
        labelFormatter={(label) => {
          const item = data.find(item => item.date === label);
          return item ? item.fullDate : label;
        }}
      />
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke={chartColor.stroke} 
        strokeWidth={2}
        dot={{ r: 4, strokeWidth: 1, fill: '#fff' }}
        activeDot={{ r: 6, strokeWidth: 0, fill: chartColor.stroke }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export const BarChartComponent: React.FC<CartesianChartProps> = ({ data, chartColor }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={data}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis 
        dataKey="date" 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10 }}
        domain={[0, 100]}
        tickCount={5}
      />
      <Tooltip
        formatter={(value: number) => [`${value}%`, 'Progresso']}
        labelFormatter={(label) => {
          const item = data.find(item => item.date === label);
          return item ? item.fullDate : label;
        }}
      />
      <Bar 
        dataKey="value" 
        fill={chartColor.fill}
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
);

interface AggregateChartProps {
  data: { name: string; value: number; }[];
}

export const PieChartComponent: React.FC<AggregateChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={70}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number) => [`${value} ocorrências`, '']}
      />
    </PieChart>
  </ResponsiveContainer>
);

export const RadarChartComponent: React.FC<AggregateChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius={70} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
      <Radar
        name="Ocorrências"
        dataKey="value"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
      <Tooltip />
    </RadarChart>
  </ResponsiveContainer>
);
