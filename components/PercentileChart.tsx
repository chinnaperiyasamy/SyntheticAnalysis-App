import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { MetricSummary } from '../types';
import { CHART_COLORS } from '../constants';

interface PercentileChartProps {
  summaries: MetricSummary[];
}

export const PercentileChart: React.FC<PercentileChartProps> = ({ summaries }) => {
  const data = summaries.map(s => ({
    name: s.metric,
    Avg: s.avg,
    P95: s.p95,
    P99: s.p99,
    Max: s.max
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <Tooltip 
            cursor={{fill: '#334155', opacity: 0.4}}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>
          <Bar dataKey="Avg" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="P95" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="P99" fill={CHART_COLORS[5]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Max" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
