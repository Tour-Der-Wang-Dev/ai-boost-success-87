import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  AlertTriangle,
  Target,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
  stats: {
    executed: number;
    success_rate: number;
    customers_affected: number;
  };
}

const workflows: Workflow[] = [
  {
    id: 'health-monitoring',
    name: 'Health Score Monitoring',
    description: 'Automatically monitor customer health scores and trigger alerts for declining scores',
    icon: TrendingUp,
    color: 'text-accent',
    isActive: true,
    triggers: ['Health score drops below 60%', 'No activity for 14 days'],
    actions: ['Send alert to CSM', 'Create follow-up task', 'Log risk event'],
    stats: {
      executed: 47,
      success_rate: 94,
      customers_affected: 23
    }
  },
  {
    id: 'churn-prevention',
    name: 'Churn Risk Prevention',
    description: 'Identify and automatically engage customers showing churn risk signals',
    icon: AlertTriangle,
    color: 'text-orange-600',
    isActive: true,
    triggers: ['Support ticket escalation', 'Usage decline >50%', 'Payment delays'],
    actions: ['Schedule intervention call', 'Send retention email', 'Assign to senior CSM'],
    stats: {
      executed: 23,
      success_rate: 87,
      customers_affected: 18
    }
  },
  {
    id: 'expansion-opportunities',
    name: 'Expansion Opportunity Detection',
    description: 'Identify customers ready for upselling or cross-selling opportunities',
    icon: Target,
    color: 'text-primary',
    isActive: true,
    triggers: ['High engagement scores', 'Feature limit reached', 'Team growth >20%'],
    actions: ['Create expansion opportunity', 'Schedule growth call', 'Send upgrade proposal'],
    stats: {
      executed: 31,
      success_rate: 76,
      customers_affected: 24
    }
  },
  {
    id: 'onboarding-automation',
    name: 'Smart Onboarding',
    description: 'Personalized onboarding workflows based on customer profile and use case',
    icon: Users,
    color: 'text-secondary',
    isActive: true,
    triggers: ['New customer signup', 'Trial conversion', 'Plan upgrade'],
    actions: ['Send welcome sequence', 'Schedule kickoff call', 'Assign onboarding specialist'],
    stats: {
      executed: 15,
      success_rate: 96,
      customers_affected: 15
    }
  },
  {
    id: 'engagement-optimization',
    name: 'Engagement Optimization',
    description: 'Automatically optimize customer engagement based on usage patterns',
    icon: BarChart3,
    color: 'text-blue-600',
    isActive: false,
    triggers: ['Low product usage', 'Feature abandonment', 'Login frequency decline'],
    actions: ['Send usage tips', 'Recommend features', 'Schedule training session'],
    stats: {
      executed: 8,
      success_rate: 82,
      customers_affected: 6
    }
  },
  {
    id: 'renewal-reminders',
    name: 'Contract Renewal Management',
    description: 'Automated renewal reminders and contract management workflows',
    icon: Calendar,
    color: 'text-purple-600',
    isActive: true,
    triggers: ['90 days to renewal', '30 days to renewal', 'Contract expired'],
    actions: ['Send renewal reminder', 'Schedule renewal call', 'Create renewal opportunity'],
    stats: {
      executed: 12,
      success_rate: 91,
      customers_affected: 12
    }
  }
];

interface AIWorkflowsProps {
  onWorkflowToggle?: (workflowId: string, isActive: boolean) => void;
  onWorkflowConfigure?: (workflowId: string) => void;
}

export const AIWorkflows: React.FC<AIWorkflowsProps> = ({
  onWorkflowToggle,
  onWorkflowConfigure
}) => {
  const [activeWorkflows, setActiveWorkflows] = useState<Record<string, boolean>>(
    workflows.reduce((acc, workflow) => ({
      ...acc,
      [workflow.id]: workflow.isActive
    }), {})
  );

  const handleToggleWorkflow = (workflowId: string, isActive: boolean) => {
    setActiveWorkflows(prev => ({
      ...prev,
      [workflowId]: isActive
    }));
    onWorkflowToggle?.(workflowId, isActive);
  };

  const totalExecutions = workflows.reduce((sum, w) => sum + w.stats.executed, 0);
  const averageSuccessRate = workflows.reduce((sum, w) => sum + w.stats.success_rate, 0) / workflows.length;
  const activeWorkflowCount = Object.values(activeWorkflows).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeWorkflowCount}</div>
                <div className="text-sm text-muted-foreground">Active Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalExecutions}</div>
                <div className="text-sm text-muted-foreground">Total Executions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{averageSuccessRate.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.stats.customers_affected, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Customers Impacted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>AI Automation Workflows</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;
              const isActive = activeWorkflows[workflow.id];
              
              return (
                <div
                  key={workflow.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isActive ? 'bg-accent/5 border-accent/20' : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg bg-background border flex items-center justify-center ${
                        isActive ? 'border-accent/20' : 'border-border'
                      }`}>
                        <Icon className={`w-6 h-6 ${workflow.color}`} />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
                            {isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {workflow.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">TRIGGERS</h4>
                            <ul className="space-y-1">
                              {workflow.triggers.map((trigger, index) => (
                                <li key={index} className="text-xs flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  <span>{trigger}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">ACTIONS</h4>
                            <ul className="space-y-1">
                              {workflow.actions.map((action, index) => (
                                <li key={index} className="text-xs flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t">
                          <div className="text-center">
                            <div className="text-lg font-bold">{workflow.stats.executed}</div>
                            <div className="text-xs text-muted-foreground">Executed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{workflow.stats.success_rate}%</div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{workflow.stats.customers_affected}</div>
                            <div className="text-xs text-muted-foreground">Customers</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center space-x-3 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onWorkflowConfigure?.(workflow.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) => handleToggleWorkflow(workflow.id, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isActive ? 'On' : 'Off'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Health monitoring triggered</span>
                <span className="text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Expansion opportunity created</span>
                <span className="text-muted-foreground">15 min ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Churn prevention activated</span>
                <span className="text-muted-foreground">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Automation Success</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time Saved</span>
                  <span className="font-medium">156 hours</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Play className="w-4 h-4 mr-2" />
              Run Health Check
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              Find Opportunities
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
