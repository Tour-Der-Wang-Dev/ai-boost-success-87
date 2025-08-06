import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomers } from '@/hooks/useCustomers';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';

interface AIPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (prompt: string, customerId?: string) => void;
}

export const AIPromptDialog: React.FC<AIPromptDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const { customers } = useCustomers();
  const [prompt, setPrompt] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const promptTemplates = [
    {
      id: 'health-analysis',
      title: 'Customer Health Analysis',
      prompt: 'Analyze the overall health scores of all customers and identify patterns, trends, and customers that need immediate attention. Focus on engagement levels, usage patterns, and potential risks.'
    },
    {
      id: 'churn-risk',
      title: 'Churn Risk Assessment',
      prompt: 'Identify customers who are at high risk of churning based on their recent activity, engagement metrics, and behavioral patterns. Provide specific recommendations for retention strategies.'
    },
    {
      id: 'upsell-opportunities',
      title: 'Upselling Opportunities',
      prompt: 'Find customers who would benefit from upgrading their current plan or purchasing additional services. Base recommendations on usage patterns, growth trends, and customer success indicators.'
    },
    {
      id: 'engagement-strategy',
      title: 'Engagement Strategy',
      prompt: 'Suggest personalized engagement strategies for improving customer satisfaction and increasing product adoption. Consider communication preferences and success metrics.'
    },
    {
      id: 'customer-segmentation',
      title: 'Customer Segmentation',
      prompt: 'Segment customers into meaningful groups based on their behavior, value, and needs. Provide insights on how to approach each segment differently.'
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics Analysis',
      prompt: 'Analyze key customer success metrics and KPIs. Identify which metrics are most predictive of customer satisfaction and long-term retention.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim(), selectedCustomer || undefined);
      setPrompt('');
      setSelectedCustomer('');
      setSelectedTemplate('');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      setPrompt(template.prompt);
      setSelectedTemplate(templateId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Generate AI Insight</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <Label>เลือกเทมเพลต (ไม่บังคับ)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกเทมเพลตคำสั่ง AI" />
              </SelectTrigger>
              <SelectContent>
                {promptTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Selection */}
          <div className="space-y-3">
            <Label>เลือกลูกค้า (ไม่บังคับ)</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="วิเคราะห์ลูกค้าทั้งหมด หรือเลือกลูกค้าเฉพาะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ลูกค้าทั้งหมด</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} {customer.company && `(${customer.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <Label htmlFor="prompt">คำสั่ง AI Prompt *</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="อธิบายสิ่งที่คุณต้องการให้ AI วิเคราะห์เกี่ยวกับลูกค้า เช่น 'วิเคราะห์ลูกค้าที่มีความเสี่ยงสูงในการยกเลิกบริการ' หรือ 'หาโอกาสในการขายเพิ่มให้กับลูกค้าปัจจุบัน'"
              rows={4}
              required
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              ใช้ภาษาอังกฤษหรือภาษาไทยก็ได้ AI จะเข้าใจและตอบกลับในรูปแบบที่เหมาะสม
            </p>
          </div>

          {/* AI Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">เกี่ยวกับ AI Assistant</h4>
                  <p className="text-sm text-muted-foreground">
                    AI จะวิเคราะห์ข้อมูลลูกค้าของคุณและให้คำแนะนำที่มีประโยชน์ 
                    สามารถวิเคราะห์ทั้งลูกค้าเฉพาะรายหรือลูกค้าทั้งหมดพร้อมกัน
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={!prompt.trim()}>
              <Brain className="w-4 h-4 mr-2" />
              สร้าง AI Insight
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};