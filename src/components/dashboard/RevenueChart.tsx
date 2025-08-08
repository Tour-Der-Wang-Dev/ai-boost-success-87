import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

interface RevenueData {
  month: string;
  revenue: number;
  growth: number;
}

const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 42000, growth: 5.2 },
  { month: 'Feb', revenue: 45000, growth: 7.1 },
  { month: 'Mar', revenue: 48000, growth: 6.7 },
  { month: 'Apr', revenue: 51000, growth: 6.3 },
  { month: 'May', revenue: 54000, growth: 5.9 },
  { month: 'Jun', revenue: 58000, growth: 7.4 },
  { month: 'Jul', revenue: 62000, growth: 6.9 },
  { month: 'Aug', revenue: 65000, growth: 4.8 },
  { month: 'Sep', revenue: 68000, growth: 4.6 },
  { month: 'Oct', revenue: 72000, growth: 5.9 },
  { month: 'Nov', revenue: 76000, growth: 5.6 },
  { month: 'Dec', revenue: 80000, growth: 5.3 }
];

interface RevenueChartProps {
  data?: RevenueData[];
  className?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data = mockRevenueData,
  className = ""
}) => {
  const currentRevenue = data[data.length - 1]?.revenue || 0;
  const previousRevenue = data[data.length - 2]?.revenue || 0;
  const growthPercentage = previousRevenue > 0 
    ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
    : '0';

  const formatRevenue = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border shadow-lg rounded-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Revenue: {formatRevenue(payload[0].value)}
          </p>
          <p className="text-accent text-sm">
            Growth: +{payload[0].payload.growth}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`bg-gradient-card shadow-card border-0 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Revenue Trend</span>
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-2xl font-bold">{formatRevenue(currentRevenue)}</span>
              <div className="flex items-center text-accent">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+{growthPercentage}%</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>vs last month</p>
            <p className="text-xs">Monthly Recurring Revenue</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                tickFormatter={formatRevenue}
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
