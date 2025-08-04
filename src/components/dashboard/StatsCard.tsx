import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    trendPositive: 'text-accent',
    trendNegative: 'text-destructive'
  },
  success: {
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    trendPositive: 'text-accent',
    trendNegative: 'text-destructive'
  },
  warning: {
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    trendPositive: 'text-accent',
    trendNegative: 'text-destructive'
  },
  danger: {
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    trendPositive: 'text-accent',
    trendNegative: 'text-destructive'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className
}) => {
  const styles = variantStyles[variant];

  return (
    <Card className={cn(
      "bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 border-0",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-foreground">
                {value}
              </h3>
              {trend && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    trend.positive ? styles.trendPositive : styles.trendNegative
                  )}
                >
                  {trend.positive ? '+' : ''}{trend.value}% {trend.label}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            styles.iconBg
          )}>
            <Icon className={cn("w-6 h-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};