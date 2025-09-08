import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { StudentStats } from '@/types/student';

interface RiskChartProps {
  stats: StudentStats;
}

const COLORS = {
  high: 'hsl(var(--risk-high))',
  medium: 'hsl(var(--risk-medium))',
  low: 'hsl(var(--risk-low))',
};

export function RiskChart({ stats }: RiskChartProps) {
  const data = [
    { name: 'High Risk', value: stats.high, color: COLORS.high },
    { name: 'Medium Risk', value: stats.medium, color: COLORS.medium },
    { name: 'Low Risk', value: stats.low, color: COLORS.low },
  ].filter(item => item.value > 0);

  if (stats.total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No students added yet
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}: {entry.payload.value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}