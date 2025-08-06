import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MoreHorizontal,
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AIInsight } from '@/hooks/useAIInsights';

interface AIInsightCardProps {
  insight: AIInsight;
  onDelete?: (id: string) => void;
  className?: string;
}

const typeConfig = {
  'health_analysis': { 
    icon: TrendingUp, 
    label: 'วิเคราะห์สุขภาพ', 
    color: 'bg-accent/10 text-accent',
    bgColor: 'bg-accent/5'
  },
  'recommendation': { 
    icon: Lightbulb, 
    label: 'คำแนะนำ', 
    color: 'bg-primary/10 text-primary',
    bgColor: 'bg-primary/5'
  },
  'risk_assessment': { 
    icon: AlertTriangle, 
    label: 'ประเมินความเสี่ยง', 
    color: 'bg-orange-100 text-orange-600',
    bgColor: 'bg-orange-50'
  },
  'opportunity': { 
    icon: Target, 
    label: 'โอกาส', 
    color: 'bg-secondary/10 text-secondary',
    bgColor: 'bg-secondary/5'
  }
};

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  onDelete,
  className
}) => {
  const typeInfo = typeConfig[insight.insight_type];
  const TypeIcon = typeInfo.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceLevel = (score?: number) => {
    if (!score) return { label: 'ไม่ระบุ', color: 'bg-muted text-muted-foreground' };
    
    if (score >= 0.9) return { label: 'สูงมาก', color: 'bg-accent/10 text-accent' };
    if (score >= 0.8) return { label: 'สูง', color: 'bg-primary/10 text-primary' };
    if (score >= 0.7) return { label: 'ปานกลาง', color: 'bg-orange-100 text-orange-600' };
    return { label: 'ต่ำ', color: 'bg-destructive/10 text-destructive' };
  };

  const confidenceInfo = getConfidenceLevel(insight.confidence_score);

  return (
    <Card className={cn(
      "bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 border-0",
      typeInfo.bgColor,
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* AI Insight Type Icon */}
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", typeInfo.color)}>
              <TypeIcon className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={typeInfo.color}>
                  {typeInfo.label}
                </Badge>
                {insight.confidence_score && (
                  <Badge variant="outline" className={confidenceInfo.color}>
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {confidenceInfo.label} ({Math.round(insight.confidence_score * 100)}%)
                  </Badge>
                )}
              </div>
              
              <h3 className="font-bold text-foreground text-lg mb-2">
                {insight.title}
              </h3>
              
              {/* Customer Info */}
              {insight.customer && (
                <div className="flex items-center space-x-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {insight.customer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{insight.customer.name}</span>
                    {insight.customer.company && (
                      <span className="text-muted-foreground"> • {insight.customer.company}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Export Insight
              </DropdownMenuItem>
              <DropdownMenuItem>
                Share Insight
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(insight.id)}
                className="text-destructive focus:text-destructive"
              >
                Delete Insight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* AI Generated Content */}
        <div className="bg-background/50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2 mb-2">
            <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">AI Analysis</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.content}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>สร้างเมื่อ: {formatDate(insight.created_at)}</span>
            </div>
            
            {insight.metadata?.ai_model && (
              <div className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>Model: {insight.metadata.ai_model}</span>
              </div>
            )}
          </div>
          
          {insight.metadata?.prompt && (
            <div className="text-xs text-muted-foreground max-w-xs truncate">
              Prompt: {insight.metadata.prompt}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            Apply Suggestion
          </Button>
          <Button variant="ghost" size="sm">
            Generate More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};