import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Brain, 
  Share2, 
  CreditCard,
  Settings,
  Menu
} from 'lucide-react';

interface NavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: Users,
    description: 'Manage Customers',
    badge: 'Core'
  },
  {
    path: '/activities',
    label: 'Activities',
    icon: Activity,
    description: 'Track Interactions'
  },
  {
    path: '/ai-assistant',
    label: 'AI Assistant',
    icon: Brain,
    description: 'Gemini AI Insights',
    badge: 'AI'
  },
  {
    path: '/social-share',
    label: 'Social Share',
    icon: Share2,
    description: 'Ayrshare Integration'
  },
  {
    path: '/billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Subscription & Plans',
    badge: 'Pro'
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    description: 'Account Settings'
  }
];

export const Navigation: React.FC<NavigationProps> = ({
  currentPath = '/',
  onNavigate,
  className,
  isCollapsed = false,
  onToggle
}) => {
  return (
    <nav className={cn(
      "flex flex-col h-full bg-gradient-card border-r shadow-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">CSM Pro</h1>
                <p className="text-xs text-muted-foreground">Customer Success</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 transition-all duration-200",
                isActive && "bg-primary shadow-glow",
                !isActive && "hover:bg-muted hover:shadow-card",
                isCollapsed && "px-2 justify-center"
              )}
              onClick={() => onNavigate?.(item.path)}
            >
              <div className="flex items-center w-full">
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary-foreground" : "text-muted-foreground",
                  !isCollapsed && "mr-3"
                )} />
                
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium",
                        isActive ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="bg-gradient-primary p-3 rounded-lg text-center">
            <h3 className="font-semibold text-primary-foreground text-sm">Upgrade to Pro</h3>
            <p className="text-primary-foreground/80 text-xs mt-1">
              Unlock advanced AI features
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2 w-full"
              onClick={() => onNavigate?.('/billing')}
            >
              Get Pro
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};