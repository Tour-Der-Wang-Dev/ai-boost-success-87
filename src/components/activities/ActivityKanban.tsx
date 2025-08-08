import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Phone,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Activity {
  id: string;
  title: string;
  description?: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'milestone';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  due_date?: string;
  customer?: {
    name: string;
    avatar_url?: string;
  };
  priority?: 'low' | 'medium' | 'high';
}

interface ActivityKanbanProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
  onStatusUpdate?: (activityId: string, status: string) => void;
  onCreateActivity?: (status: string) => void;
}

const statusColumns = [
  { 
    status: 'pending', 
    title: 'To Do', 
    icon: Clock, 
    color: 'bg-orange-100 border-orange-200',
    iconColor: 'text-orange-600'
  },
  { 
    status: 'in-progress', 
    title: 'In Progress', 
    icon: Target, 
    color: 'bg-primary/10 border-primary/20',
    iconColor: 'text-primary'
  },
  { 
    status: 'completed', 
    title: 'Completed', 
    icon: CheckCircle, 
    color: 'bg-accent/10 border-accent/20',
    iconColor: 'text-accent'
  }
];

export const ActivityKanban: React.FC<ActivityKanbanProps> = ({
  activities,
  onEdit,
  onDelete,
  onStatusUpdate,
  onCreateActivity
}) => {
  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);

  const getActivityIcon = (type: string) => {
    const iconClasses = "w-4 h-4";
    
    switch (type) {
      case 'call':
        return <Phone className={iconClasses} />;
      case 'email':
        return <Mail className={iconClasses} />;
      case 'meeting':
        return <Calendar className={iconClasses} />;
      case 'note':
        return <FileText className={iconClasses} />;
      case 'task':
        return <Target className={iconClasses} />;
      case 'milestone':
        return <Target className={iconClasses} />;
      default:
        return <MessageSquare className={iconClasses} />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  const handleDragStart = (e: React.DragEvent, activity: Activity) => {
    setDraggedActivity(activity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedActivity && onStatusUpdate) {
      onStatusUpdate(draggedActivity.id, newStatus);
    }
    setDraggedActivity(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => {
        const Icon = column.icon;
        const columnActivities = activities.filter(activity => activity.status === column.status);
        
        return (
          <Card key={column.status} className={`${column.color} border-2`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${column.iconColor}`} />
                  <span className="text-sm font-medium">{column.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {columnActivities.length}
                  </Badge>
                </div>
                {onCreateActivity && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => onCreateActivity(column.status)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent 
              className="space-y-3 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {columnActivities.map((activity) => (
                <div
                  key={activity.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity)}
                  className="bg-card border rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-move"
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getActivityIcon(activity.type)}
                        <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(activity)}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onDelete(activity.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Description */}
                    {activity.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                    )}

                    {/* Priority and Due Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(activity.priority)}
                        {activity.due_date && (
                          <div className={`text-xs flex items-center space-x-1 ${
                            isOverdue(activity.due_date) ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatDueDate(activity.due_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer */}
                    {activity.customer && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={activity.customer.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {getInitials(activity.customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate">
                          {activity.customer.name}
                        </span>
                      </div>
                    )}

                    {/* Overdue warning */}
                    {isOverdue(activity.due_date) && (
                      <div className="flex items-center space-x-1 text-destructive bg-destructive/10 px-2 py-1 rounded text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Overdue</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {columnActivities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-xs">No activities</div>
                  {onCreateActivity && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-xs"
                      onClick={() => onCreateActivity(column.status)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Activity
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
