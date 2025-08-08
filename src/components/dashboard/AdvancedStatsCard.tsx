import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AdvancedStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  chart?: {
    data: number[];
    color: string;
  };
}

export const AdvancedStatsCard: React.FC<AdvancedStatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  progress,
  chart
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'bg-accent/10',
          iconColor: 'text-accent',
          gradientFrom: 'from-accent/5',
          gradientTo: 'to-transparent'
        };
      case 'warning':
        return {
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          gradientFrom: 'from-orange-50',
          gradientTo: 'to-transparent'
        };
      case 'destructive':
        return {
          iconBg: 'bg-destructive/10',
          iconColor: 'text-destructive',
          gradientFrom: 'from-destructive/5',
          gradientTo: 'to-transparent'
        };
      default:
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          gradientFrom: 'from-primary/5',
          gradientTo: 'to-transparent'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} shadow-card hover:shadow-elegant transition-all duration-300 border-0 group`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center space-x-2">
                <Badge
                  variant={trend.positive ? "default" : "destructive"}
                  className="text-xs px-2 py-1"
                >
                  {trend.positive ? '+' : ''}{trend.value}%
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>

          {chart && (
            <div className="flex items-end space-x-1 opacity-60">
              {chart.data.map((item, index) => (
                <div
                  key={index}
                  className={`w-1 rounded-full ${chart.color}`}
                  style={{ height: `${(item / Math.max(...chart.data)) * 30}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {progress && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{progress.label}</span>
              <span className="font-medium">{progress.value}/{progress.max}</span>
            </div>
            <Progress 
              value={(progress.value / progress.max) * 100} 
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
