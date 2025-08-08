import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapData {
  date: string;
  value: number;
  activities: number;
}

const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const activities = Math.floor(Math.random() * 15);
    const value = Math.min(activities / 10, 1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value,
      activities
    });
  }
  
  return data;
};

interface ActivityHeatmapProps {
  data?: HeatmapData[];
  className?: string;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ 
  data = generateHeatmapData(),
  className = ""
}) => {
  const getIntensityColor = (value: number) => {
    if (value === 0) return 'bg-muted';
    if (value <= 0.25) return 'bg-primary/20';
    if (value <= 0.5) return 'bg-primary/40';
    if (value <= 0.75) return 'bg-primary/60';
    return 'bg-primary';
  };

  const getWeekData = (startIndex: number) => {
    return data.slice(startIndex, startIndex + 7);
  };

  const weeks = Math.ceil(data.length / 7);
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const totalActivities = data.reduce((sum, day) => sum + day.activities, 0);
  const avgActivities = (totalActivities / data.length).toFixed(1);
  const maxDay = data.reduce((max, day) => day.activities > max.activities ? day : max);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className={`bg-gradient-card shadow-card border-0 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Activity Heatmap</span>
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Avg:</span>
                <span className="text-sm font-medium">{avgActivities}/day</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Peak:</span>
                <span className="text-sm font-medium">{maxDay.activities} activities</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-xs">
              Last 90 days
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Week labels */}
          <div className="flex items-center space-x-1">
            <div className="w-8" /> {/* Spacer for month labels */}
            {weekLabels.map((label, index) => (
              <div key={index} className="w-3 text-xs text-muted-foreground text-center">
                {label.charAt(0)}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <TooltipProvider>
            <div className="space-y-1">
              {Array.from({ length: weeks }).map((_, weekIndex) => {
                const weekData = getWeekData(weekIndex * 7);
                const isFirstOfMonth = weekData.some(day => {
                  const date = new Date(day.date);
                  return date.getDate() === 1;
                });
                
                return (
                  <div key={weekIndex} className="flex items-center space-x-1">
                    <div className="w-8 text-xs text-muted-foreground">
                      {isFirstOfMonth && weekData.length > 0 && (
                        <span>
                          {new Date(weekData.find(day => new Date(day.date).getDate() === 1)?.date || weekData[0].date)
                            .toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      )}
                    </div>
                    {weekData.map((day, dayIndex) => (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50 ${getIntensityColor(day.value)}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{formatDate(day.date)}</p>
                            <p>{day.activities} activities</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                );
              })}
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex items-center space-x-1">
              {[0, 0.25, 0.5, 0.75, 1].map((value, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(value)}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
