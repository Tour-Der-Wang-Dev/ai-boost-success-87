import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Phone,
  Mail,
  Users,
  FileText,
  CheckSquare,
  Target,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Activity } from '@/hooks/useActivities';

interface ActivityCardProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
  onStatusUpdate?: (status: Activity['status']) => void;
  className?: string;
}

const typeConfig = {
  call: { icon: Phone, label: 'โทรศัพท์', color: 'bg-primary/10 text-primary' },
  email: { icon: Mail, label: 'อีเมล', color: 'bg-secondary/10 text-secondary' },
  meeting: { icon: Users, label: 'ประชุม', color: 'bg-accent/10 text-accent' },
  note: { icon: FileText, label: 'บันทึก', color: 'bg-muted/50 text-muted-foreground' },
  task: { icon: CheckSquare, label: 'งาน', color: 'bg-orange-100 text-orange-600' },
  milestone: { icon: Target, label: 'เป้าหมาย', color: 'bg-purple-100 text-purple-600' }
};

const statusConfig = {
  'pending': { label: 'รอดำเนินการ', color: 'bg-orange-100 text-orange-800' },
  'in-progress': { label: 'กำลังดำเนินการ', color: 'bg-primary/10 text-primary' },
  'completed': { label: 'เสร็จสิ้น', color: 'bg-accent/10 text-accent' },
  'cancelled': { label: 'ยกเลิก', color: 'bg-destructive/10 text-destructive' }
};

const priorityConfig = {
  'low': { label: 'ต่ำ', color: 'bg-muted/50 text-muted-foreground' },
  'medium': { label: 'ปานกลาง', color: 'bg-primary/10 text-primary' },
  'high': { label: 'สูง', color: 'bg-orange-100 text-orange-600' },
  'urgent': { label: 'เร่งด่วน', color: 'bg-destructive/10 text-destructive' }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
  onStatusUpdate,
  className
}) => {
  const typeInfo = typeConfig[activity.type];
  const statusInfo = statusConfig[activity.status];
  const priorityInfo = priorityConfig[activity.priority];
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

  const isOverdue = activity.due_date && 
    new Date(activity.due_date) < new Date() && 
    activity.status !== 'completed';

  return (
    <Card className={cn(
      "bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 border-0",
      isOverdue && "border-l-4 border-l-destructive",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Activity Type Icon */}
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeInfo.color)}>
              <TypeIcon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              {activity.customer && (
                <div className="flex items-center space-x-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {activity.customer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{activity.customer.name}</span>
                    {activity.customer.company && (
                      <span className="text-muted-foreground"> • {activity.customer.company}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
                <Badge variant="outline" className={priorityInfo.color}>
                  {priorityInfo.label}
                </Badge>
                <Badge variant="outline" className={typeInfo.color}>
                  {typeInfo.label}
                </Badge>
              </div>

              {/* Dates */}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>สร้าง: {formatDate(activity.created_at)}</span>
                </div>
                
                {activity.due_date && (
                  <div className={cn(
                    "flex items-center space-x-1",
                    isOverdue && "text-destructive font-medium"
                  )}>
                    <Clock className="w-3 h-3" />
                    <span>กำหนด: {formatDate(activity.due_date)}</span>
                    {isOverdue && <span className="text-destructive">(เลยกำหนด)</span>}
                  </div>
                )}
                
                {activity.completed_at && (
                  <div className="flex items-center space-x-1 text-accent">
                    <CheckSquare className="w-3 h-3" />
                    <span>เสร็จ: {formatDate(activity.completed_at)}</span>
                  </div>
                )}
              </div>
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
              <DropdownMenuItem onClick={() => onEdit?.(activity)}>
                แก้ไขกิจกรรม
              </DropdownMenuItem>
              
              {activity.status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusUpdate?.('completed')}>
                  ทำเครื่องหมายเสร็จสิ้น
                </DropdownMenuItem>
              )}
              
              {activity.status === 'pending' && (
                <DropdownMenuItem onClick={() => onStatusUpdate?.('in-progress')}>
                  เริ่มดำเนินการ
                </DropdownMenuItem>
              )}
              
              {activity.status !== 'cancelled' && (
                <DropdownMenuItem onClick={() => onStatusUpdate?.('cancelled')}>
                  ยกเลิกกิจกรรม
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => onDelete?.(activity.id)}
                className="text-destructive focus:text-destructive"
              >
                ลบกิจกรรม
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};