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
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            ใช้ AI เพื่อวิเคราะห์และให้คำแนะนำสำหรับ Customer Success
          </p>
        </div>
        <Button onClick={() => setIsPromptDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate Insight
        </Button>
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

      {/* AI Insights Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="health_analysis">วิเคราะห์สุขภาพ</TabsTrigger>
          <TabsTrigger value="recommendation">คำแนะนำ</TabsTrigger>
          <TabsTrigger value="risk_assessment">ประเมินความเสี่ยง</TabsTrigger>
          <TabsTrigger value="opportunity">โอกาส</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>AI Insights ทั้งหมด ({insights.length})</span>
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
                  <h3 className="text-lg font-medium text-foreground mb-2">ยังไม่มี AI Insights</h3>
                  <p className="text-muted-foreground mb-4">
                    เริ่มใช้ AI Assistant เพื่อวิเคราะห์ข้อมูลลูกค้า
                  </p>
                  <Button onClick={() => setIsPromptDialogOpen(true)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    สร้าง Insight แรก
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
                  <span>{type === 'health_analysis' ? 'วิเคราะห์สุขภาพ' : 
                          type === 'recommendation' ? 'คำแนะนำ' :
                          type === 'risk_assessment' ? 'ประเมินความเสี่ยง' : 'โอกาส'} 
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
                      ไม่มี Insights ประเภทนี้
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      ลองสร้าง AI Insight ใหม่เพื่อเพิ่มข้อมูลในหมวดนี้
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
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
