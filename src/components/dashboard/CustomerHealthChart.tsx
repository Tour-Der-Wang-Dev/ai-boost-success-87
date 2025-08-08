import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, TrendingUp, AlertTriangle, UserCheck } from 'lucide-react';

interface HealthData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

const mockHealthData: HealthData[] = [
  { name: 'Excellent (90-100%)', value: 35, color: 'hsl(var(--accent))', icon: 'excellent' },
  { name: 'Good (70-89%)', value: 42, color: 'hsl(var(--primary))', icon: 'good' },
  { name: 'Fair (50-69%)', value: 18, color: 'hsl(46, 100%, 50%)', icon: 'fair' },
  { name: 'At Risk (0-49%)', value: 5, color: 'hsl(var(--destructive))', icon: 'risk' }
];

interface CustomerHealthChartProps {
  data?: HealthData[];
  className?: string;
}

export const CustomerHealthChart: React.FC<CustomerHealthChartProps> = ({ 
  data = mockHealthData,
  className = ""
}) => {
  const totalCustomers = data.reduce((sum, item) => sum + item.value, 0);
  const healthyCustomers = data.slice(0, 2).reduce((sum, item) => sum + item.value, 0);
  const healthPercentage = ((healthyCustomers / totalCustomers) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border shadow-lg rounded-lg p-3">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-primary">
            {data.value} customers ({((data.value / totalCustomers) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'excellent':
        return <UserCheck className="w-4 h-4" />;
      case 'good':
        return <TrendingUp className="w-4 h-4" />;
      case 'fair':
        return <Users className="w-4 h-4" />;
      case 'risk':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`bg-gradient-card shadow-card border-0 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Customer Health Distribution</span>
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-2xl font-bold">{healthPercentage}%</span>
              <span className="text-sm text-muted-foreground">customers are healthy</span>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Total: {totalCustomers}</p>
            <p className="text-xs">Active customers</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center space-x-1 min-w-0">
                {getIcon(item.icon)}
                <span className="text-xs text-muted-foreground truncate">
                  {item.name.split(' ')[0]}
                </span>
                <span className="text-xs font-medium">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
