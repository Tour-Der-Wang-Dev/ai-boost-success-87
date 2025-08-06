import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AIInsight {
  id: string;
  customer_id?: string;
  insight_type: 'health_analysis' | 'recommendation' | 'risk_assessment' | 'opportunity';
  title: string;
  content: string;
  confidence_score?: number;
  metadata?: any;
  created_by: string;
  created_at: string;
  // Join data
  customer?: {
    name: string;
    email: string;
    company?: string;
  };
}

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all AI insights
  const fetchInsights = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_insights')
        .select(`
          *,
          customers (
            name,
            email,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setInsights((data || []) as AIInsight[]);
    } catch (error: any) {
      console.error('Error fetching AI insights:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูล AI Insights ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate a new AI insight (Mock implementation)
  const generateInsight = async (prompt: string, customerId?: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setLoading(true);
      
      // Mock AI response generation
      const mockInsights = [
        {
          type: 'health_analysis',
          title: 'Customer Health Analysis',
          content: 'Based on recent activity patterns, customers with health scores below 60% show decreased engagement. Consider implementing proactive outreach strategies for these accounts.'
        },
        {
          type: 'recommendation',
          title: 'Engagement Recommendation',
          content: 'Implement weekly check-in calls for high-value customers. Data shows 23% improvement in retention when regular touchpoints are maintained.'
        },
        {
          type: 'risk_assessment',
          title: 'Churn Risk Detection',
          content: 'Three customers have not engaged in the last 14 days and show declining usage patterns. Immediate intervention recommended.'
        },
        {
          type: 'opportunity',
          title: 'Upselling Opportunity',
          content: 'Five customers are approaching usage limits and may benefit from plan upgrades. Estimated revenue opportunity: $15,000/month.'
        }
      ];

      // Determine insight type based on prompt keywords
      let insightType = 'recommendation';
      if (prompt.toLowerCase().includes('health') || prompt.toLowerCase().includes('score')) {
        insightType = 'health_analysis';
      } else if (prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('churn')) {
        insightType = 'risk_assessment';
      } else if (prompt.toLowerCase().includes('opportunity') || prompt.toLowerCase().includes('growth')) {
        insightType = 'opportunity';
      }

      const selectedInsight = mockInsights.find(i => i.type === insightType) || mockInsights[0];

      const { data, error } = await supabase
        .from('ai_insights')
        .insert({
          customer_id: customerId || null,
          insight_type: selectedInsight.type as AIInsight['insight_type'],
          title: selectedInsight.title,
          content: selectedInsight.content,
          confidence_score: Math.random() * 0.3 + 0.7, // Random score between 0.7-1.0
          metadata: { 
            prompt: prompt,
            generated_at: new Date().toISOString(),
            ai_model: 'gemini-pro' // Mock
          },
          created_by: user.id,
        })
        .select(`
          *,
          customers (
            name,
            email,
            company
          )
        `)
        .single();

      if (error) throw error;

      setInsights(prev => [data as AIInsight, ...prev]);
      
      toast({
        title: "สำเร็จ",
        description: "สร้าง AI Insight ใหม่เรียบร้อยแล้ว",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error generating AI insight:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้าง AI Insight ได้",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Delete an AI insight
  const deleteInsight = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_insights')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInsights(prev => prev.filter(insight => insight.id !== id));
      
      toast({
        title: "สำเร็จ",
        description: "ลบ AI Insight เรียบร้อยแล้ว",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting AI insight:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบ AI Insight ได้",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Get insights by customer
  const getInsightsByCustomer = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select(`
          *,
          customers (
            name,
            email,
            company
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching customer insights:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  return {
    insights,
    loading,
    fetchInsights,
    generateInsight,
    deleteInsight,
    getInsightsByCustomer,
  };
};