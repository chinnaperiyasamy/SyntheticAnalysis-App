import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { DataPoint } from '../types';
import { CHART_COLORS } from '../constants';

interface MetricChartProps {
  data: DataPoint[];
  numericColumns: string[];
  xAxisKey?: string;
}

export const MetricChart: React.FC<MetricChartProps> = ({ data, numericColumns, xAxisKey }) => {
  // Try to find a sensible X-Axis if not provided
  const xKey = xAxisKey || Object.keys(data[0] || {}).find(k => k.toLowerCase().includes('time') || k.toLowerCase().includes('date')) || 'index';

  // If no timestamp column found, we can map data to add an index
  const chartData = xKey === 'index' ? data.map((d, i) => ({ ...d, index: i })) : data;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey={xKey} 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => {
                // Simple formatter for timestamps if they look like timestamps
                if (typeof value === 'string' && value.length > 10) return value.substring(11, 16); 
                return value;
            }}
          />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          {numericColumns.map((col, index) => (
            <Line
              key={col}
              type="monotone"
              dataKey={col}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              activeDot={{ r: 8 }}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
