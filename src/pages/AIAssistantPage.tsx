import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { AIPromptDialog } from '@/components/ai/AIPromptDialog';
import { AIChat } from '@/components/ai/AIChat';
import { AIWorkflows } from '@/components/ai/AIWorkflows';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Plus,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  MessageSquare,
  Zap,
  BarChart3,
  Settings,
  Bot,
  Wand2
} from 'lucide-react';

const AIAssistantPage: React.FC = () => {
  const { insights, loading, generateInsight } = useAIInsights();
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleGenerateInsight = async (prompt: string, customerId?: string) => {
    await generateInsight(prompt, customerId);
    setIsPromptDialogOpen(false);
  };

  const handleChatInsightGenerated = (insight: any) => {
    // Add the chat-generated insight to the insights list
    console.log('Chat insight generated:', insight);
  };

  const handleWorkflowToggle = (workflowId: string, isActive: boolean) => {
    console.log(`Workflow ${workflowId} ${isActive ? 'activated' : 'deactivated'}`);
  };

  const handleWorkflowConfigure = (workflowId: string) => {
    console.log(`Configure workflow ${workflowId}`);
  };

  const insightsByType = {
    health_analysis: insights.filter(i => i.insight_type === 'health_analysis'),
    recommendation: insights.filter(i => i.insight_type === 'recommendation'),
    risk_assessment: insights.filter(i => i.insight_type === 'risk_assessment'),
    opportunity: insights.filter(i => i.insight_type === 'opportunity')
  };

  const quickPrompts = [
    {
      id: 'health-check',
      title: 'Customer Health Analysis',
      description: 'วิเคราะห์สุขภาพลูกค้าทั้งหมด',
      icon: TrendingUp,
      prompt: 'Analyze overall customer health scores and identify trends',
      color: 'bg-accent/10 text-accent'
    },
    {
      id: 'risk-detection',
      title: 'Risk Detection',
      description: 'ตรวจหาลูกค้าที่เสี่ยงสูญเสีย',
      icon: AlertTriangle,
      prompt: 'Identify customers at risk of churning based on activity and engagement patterns',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'growth-opportunities',
      title: 'Growth Opportunities',
      description: 'หาโอกาสเติบโต',
      icon: Target,
      prompt: 'Find upselling and cross-selling opportunities for existing customers',
      color: 'bg-primary/10 text-primary'
    },
    {
      id: 'engagement-strategy',
      title: 'Engagement Strategy',
      description: 'แนวทางเพิ่มการมีส่วนร่วม',
      icon: Lightbulb,
      prompt: 'Suggest engagement strategies to improve customer satisfaction and retention',
      color: 'bg-secondary/10 text-secondary'
    }
  ];

  return (
    <DashboardLayout currentPath="/ai-assistant" onNavigate={handleNavigate}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center space-x-2">
            <Bot className="w-8 h-8" />
            <span>AI Customer Success Assistant</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights, automation, and intelligent customer success management
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            AI Settings
          </Button>
          <Button onClick={() => setIsPromptDialogOpen(true)}>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Insight
          </Button>
        </div>
      </div>

      {/* AI Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{insights.length}</div>
                <div className="text-sm text-muted-foreground">Total Insights</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Active Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Risk Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickPrompts.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <Card
              key={prompt.id}
              className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer border-0"
              onClick={() => handleGenerateInsight(prompt.prompt)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${prompt.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {prompt.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIChat onInsightGenerated={handleChatInsightGenerated} />
            </div>
            <div className="space-y-4">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-sm">Customer Health Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Churn Risk Prediction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">Expansion Opportunities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Strategic Recommendations</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsPromptDialogOpen(true)}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Custom Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    AI Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Insights</TabsTrigger>
              <TabsTrigger value="health_analysis">Health</TabsTrigger>
              <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
              <TabsTrigger value="risk_assessment">Risk</TabsTrigger>
              <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span>All AI Insights ({insights.length})</span>
                    </div>
                    <Badge variant="outline">Last 30 days</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2">กำลังสร้าง AI Insights...</p>
                    </div>
                  ) : insights.length > 0 ? (
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <AIInsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No AI Insights Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start using AI Assistant to analyze customer data
                      </p>
                      <Button onClick={() => setIsPromptDialogOpen(true)}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create First Insight
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {['health_analysis', 'recommendation', 'risk_assessment', 'opportunity'].map(type => (
              <TabsContent key={type} value={type} className="space-y-4">
                <Card className="bg-gradient-card shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span>{type === 'health_analysis' ? 'Health Analysis' :
                              type === 'recommendation' ? 'Recommendations' :
                              type === 'risk_assessment' ? 'Risk Assessment' : 'Opportunities'}
                        ({insightsByType[type as keyof typeof insightsByType].length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {insightsByType[type as keyof typeof insightsByType].length > 0 ? (
                      <div className="space-y-4">
                        {insightsByType[type as keyof typeof insightsByType].map((insight) => (
                          <AIInsightCard key={insight.id} insight={insight} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No {type.replace('_', ' ')} insights
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Generate insights to see data in this category
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <AIWorkflows
            onWorkflowToggle={handleWorkflowToggle}
            onWorkflowConfigure={handleWorkflowConfigure}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle>AI Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Insights Generated</span>
                    <span className="font-medium">{insights.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Automation Success</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Saved</span>
                    <span className="font-medium">156 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle>Recent AI Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Health analysis completed</span>
                    <span className="text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Risk alert triggered</span>
                    <span className="text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Opportunity identified</span>
                    <span className="text-muted-foreground">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Workflow executed</span>
                    <span className="text-muted-foreground">3 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>AI Impact Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">23</div>
                  <div className="text-sm text-muted-foreground">At-risk customers identified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$47K</div>
                  <div className="text-sm text-muted-foreground">Revenue opportunities found</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">94%</div>
                  <div className="text-sm text-muted-foreground">Customer satisfaction maintained</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Prompt Dialog */}
      <AIPromptDialog
        open={isPromptDialogOpen}
        onOpenChange={setIsPromptDialogOpen}
        onSubmit={handleGenerateInsight}
      />
    </DashboardLayout>
  );
};

export default AIAssistantPage;
