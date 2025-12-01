
import React from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface ChartProps {
  data: any[];
  height?: number;
  colors?: string[];
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showAnimation?: boolean;
  valueFormatter?: (value: number) => string;
}

interface CategoryChartProps extends ChartProps {
  categories: string[];
  index?: string;
}

interface PieChartProps extends ChartProps {
  category: string;
  index: string;
}

// Function to get color based on index and theme
const getColor = (index: number, colors?: string[]): string => {
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  if (colors && colors[index % colors.length]) {
    const color = colors[index % colors.length];
    
    // Map color names to their Tailwind CSS values
    switch (color) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'red': return '#ef4444';
      case 'purple': return '#8b5cf6';
      case 'pink': return '#ec4899';
      default: return color; // Use the provided color directly if not a name
    }
  }
  
  return defaultColors[index % defaultColors.length];
};

export const LineChart: React.FC<CategoryChartProps> = ({
  data,
  categories,
  height = 300,
  colors,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  showTooltip = true,
  showAnimation = false,
  valueFormatter = (value) => `${value}`,
  index = 'name'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showXAxis && (
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
        )}
        
        {showYAxis && (
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
        )}
        
        {showTooltip && (
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid #f3f4f6'
            }}
          />
        )}
        
        {showLegend && <Legend />}
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={getColor(index, colors)}
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={showAnimation}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const BarChart: React.FC<CategoryChartProps> = ({
  data,
  categories,
  height = 300,
  colors,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  showTooltip = true,
  showAnimation = false,
  valueFormatter = (value) => `${value}`,
  index = 'name'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showXAxis && (
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
        )}
        
        {showYAxis && (
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
        )}
        
        {showTooltip && (
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid #f3f4f6'
            }}
          />
        )}
        
        {showLegend && <Legend />}
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={getColor(index, colors)}
            radius={[4, 4, 0, 0]}
            isAnimationActive={showAnimation}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const AreaChart: React.FC<CategoryChartProps> = ({
  data,
  categories,
  height = 300,
  colors,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  showTooltip = true,
  showAnimation = false,
  valueFormatter = (value) => `${value}`,
  index = 'name'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showXAxis && (
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
        )}
        
        {showYAxis && (
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
        )}
        
        {showTooltip && (
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid #f3f4f6'
            }}
          />
        )}
        
        {showLegend && <Legend />}
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        
        {categories.map((category, index) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            fill={getColor(index, colors) + '40'} // Add transparency
            stroke={getColor(index, colors)}
            isAnimationActive={showAnimation}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  category,
  index,
  height = 300,
  colors,
  showLegend = false,
  showTooltip = true,
  showAnimation = false,
  valueFormatter = (value) => `${value}`
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={category}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          isAnimationActive={showAnimation}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index, colors)} />
          ))}
        </Pie>
        
        {showTooltip && (
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid #f3f4f6'
            }}
          />
        )}
        
        {showLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
