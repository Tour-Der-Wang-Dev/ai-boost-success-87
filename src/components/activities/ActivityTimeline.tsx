import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2
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
  user?: {
    name: string;
    avatar_url?: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
  onStatusUpdate?: (activityId: string, status: string) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  onEdit,
  onDelete,
  onStatusUpdate
}) => {
  const getActivityIcon = (type: string, status: string) => {
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
        return status === 'completed' ? <CheckCircle className={iconClasses} /> : <Target className={iconClasses} />;
      case 'milestone':
        return <Target className={iconClasses} />;
      default:
        return <MessageSquare className={iconClasses} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent border-accent text-accent';
      case 'in-progress':
        return 'bg-primary border-primary text-primary';
      case 'pending':
        return 'bg-orange-500 border-orange-500 text-orange-500';
      case 'cancelled':
        return 'bg-destructive border-destructive text-destructive';
      default:
        return 'bg-muted border-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Activity Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <h3 className="font-medium text-sm text-muted-foreground">
                  {formatDate(date)}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Activities for this date */}
              <div className="space-y-3 ml-4">
                {dayActivities.map((activity, index) => (
                  <div key={activity.id} className="relative">
                    {/* Timeline line */}
                    {index !== dayActivities.length - 1 && (
                      <div className="absolute left-5 top-12 w-px h-16 bg-border" />
                    )}
                    
                    <div className="flex items-start space-x-3">
                      {/* Activity icon */}
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background ${getStatusColor(activity.status)}`}>
                        {getActivityIcon(activity.type, activity.status)}
                      </div>

                      {/* Activity content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-sm">{activity.title}</h4>
                                {getStatusBadge(activity.status)}
                              </div>
                              
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {activity.description}
                                </p>
                              )}

                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {activity.customer && (
                                  <div className="flex items-center space-x-1">
                                    <Avatar className="w-4 h-4">
                                      <AvatarImage src={activity.customer.avatar_url} />
                                      <AvatarFallback className="text-xs">
                                        {getInitials(activity.customer.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{activity.customer.name}</span>
                                  </div>
                                )}
                                
                                <span>{new Date(activity.created_at).toLocaleTimeString()}</span>
                                
                                {activity.due_date && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Due {formatDate(activity.due_date)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {onEdit && (
                                  <DropdownMenuItem onClick={() => onEdit(activity)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {onStatusUpdate && activity.status !== 'completed' && (
                                  <DropdownMenuItem onClick={() => onStatusUpdate(activity.id, 'completed')}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Complete
                                  </DropdownMenuItem>
                                )}
                                {onStatusUpdate && activity.status === 'completed' && (
                                  <DropdownMenuItem onClick={() => onStatusUpdate(activity.id, 'pending')}>
                                    <Clock className="w-4 h-4 mr-2" />
                                    Mark Pending
                                  </DropdownMenuItem>
                                )}
                                {onDelete && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => onDelete(activity.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Activities</h3>
              <p className="text-muted-foreground">
                Start tracking your customer interactions and tasks
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
