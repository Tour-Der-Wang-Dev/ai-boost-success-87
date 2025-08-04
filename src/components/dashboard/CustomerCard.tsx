import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Phone, 
  Mail,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  status: 'active' | 'at-risk' | 'churned' | 'new';
  healthScore: number;
  lastActivity: string;
  revenue: number;
  growthRate?: number;
}

interface CustomerCardProps {
  customer: Customer;
  onSelect?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onMessage?: (customer: Customer) => void;
  className?: string;
}

const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'bg-accent text-accent-foreground',
    textColor: 'text-accent'
  },
  'at-risk': { 
    label: 'At Risk', 
    color: 'bg-orange-100 text-orange-800',
    textColor: 'text-orange-600'
  },
  churned: { 
    label: 'Churned', 
    color: 'bg-destructive/10 text-destructive',
    textColor: 'text-destructive'
  },
  new: { 
    label: 'New', 
    color: 'bg-primary/10 text-primary',
    textColor: 'text-primary'
  }
};

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onSelect,
  onEdit,
  onMessage,
  className
}) => {
  const statusStyle = statusConfig[customer.status];
  const initials = customer.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-orange-600';
    return 'text-destructive';
  };

  return (
    <Card className={cn(
      "bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer border-0",
      className
    )} onClick={() => onSelect?.(customer)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {customer.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {customer.company}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {customer.email}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit?.(customer);
              }}>
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onMessage?.(customer);
              }}>
                Send Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Status and Health Score */}
          <div className="flex items-center justify-between">
            <Badge className={statusStyle.color}>
              {statusStyle.label}
            </Badge>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Health Score</p>
              <p className={cn("font-semibold", getHealthScoreColor(customer.healthScore))}>
                {customer.healthScore}%
              </p>
            </div>
          </div>

          {/* Revenue and Growth */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              <p className="font-semibold text-foreground">
                ${customer.revenue.toLocaleString()}
              </p>
            </div>
            {customer.growthRate !== undefined && (
              <div className="flex items-center space-x-1">
                {customer.growthRate >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-accent" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  customer.growthRate >= 0 ? "text-accent" : "text-destructive"
                )}>
                  {customer.growthRate >= 0 ? '+' : ''}{customer.growthRate}%
                </span>
              </div>
            )}
          </div>

          {/* Last Activity */}
          <div>
            <p className="text-xs text-muted-foreground">Last Activity</p>
            <p className="text-sm text-foreground">{customer.lastActivity}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onMessage?.(customer);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${customer.email}`);
              }}
            >
              <Mail className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle phone action
              }}
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};