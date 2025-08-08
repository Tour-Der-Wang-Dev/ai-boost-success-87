import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
// Import only essential icons
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'insight' | 'recommendation' | 'analysis' | 'warning';
}

interface AIChatProps {
  onInsightGenerated?: (insight: any) => void;
}

const AIChatComponent: React.FC<AIChatProps> = ({ onInsightGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Customer Success Assistant. I can help you analyze customer data, generate insights, and provide recommendations. What would you like to explore today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'insight'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = useMemo(() => [
    {
      text: "Analyze customer health trends",
      color: "text-accent"
    },
    {
      text: "Identify at-risk customers",
      color: "text-orange-600"
    },
    {
      text: "Find growth opportunities",
      color: "text-primary"
    },
    {
      text: "Generate weekly report",
      color: "text-secondary"
    }
  ], []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      // If it's an insight, notify parent component
      if (aiResponse.type === 'insight' && onInsightGenerated) {
        onInsightGenerated({
          id: aiResponse.id,
          content: aiResponse.content,
          type: aiResponse.type,
          created_at: aiResponse.timestamp.toISOString()
        });
      }
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('health') || input.includes('trend')) {
      return {
        id: Date.now().toString(),
        content: `Based on your customer data analysis, I've identified the following health trends:

📈 **Positive Trends:**
• Overall customer health score has improved by 8.5% this month
• 73% of customers are in "healthy" status (score >70%)
• Customer engagement has increased by 12%

⚠️ **Areas of Concern:**
• 5 customers have declining health scores
• Average response time to support tickets has increased
• 3 customers haven't had touchpoints in 30+ days

**Recommendation:** Focus on the declining customers with targeted outreach campaigns.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis'
      };
    }
    
    if (input.includes('risk') || input.includes('churn')) {
      return {
        id: Date.now().toString(),
        content: `🚨 **At-Risk Customer Analysis:**

I've identified 7 customers requiring immediate attention:

**High Risk (3 customers):**
• Acme Corp - Health score dropped 25% in 2 weeks
• TechFlow Inc - No activity in 45 days
• DataSync Ltd - Multiple support escalations

**Medium Risk (4 customers):**
• CloudBase - Decreased feature usage
• DevTools Co - Late payments
• StartupXYZ - Reduced team engagement
• ScaleUp Inc - Product adoption concerns

**Action Items:**
1. Schedule urgent check-ins with high-risk accounts
2. Create retention campaigns for medium-risk accounts
3. Review pricing/product fit for concerning trends`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'warning'
      };
    }
    
    if (input.includes('opportunity') || input.includes('growth') || input.includes('upsell')) {
      return {
        id: Date.now().toString(),
        content: `💡 **Growth Opportunities Identified:**

**Upselling Opportunities (5 customers):**
• Enterprise Corp - Ready for premium features ($5K/month potential)
• GrowthCo - High engagement, perfect for expansion
• ScaleNow - Team size doubled, need more licenses

**Cross-selling Opportunities (8 customers):**
• 3 customers using only core features
• 5 customers perfect for add-on modules

**Expansion Signals:**
• 40% increase in API calls from top customers
• 6 customers requested enterprise features
• High NPS scores (9+) from 12 customers

**Revenue Potential:** $47,000 in additional ARR identified
**Recommended Actions:** Launch targeted expansion campaigns this week`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'recommendation'
      };
    }
    
    if (input.includes('report') || input.includes('summary')) {
      return {
        id: Date.now().toString(),
        content: `📊 **Weekly Customer Success Report:**

**Key Metrics:**
• Total Customers: 156 (+3 this week)
• Average Health Score: 78% (+2%)
• Churn Risk: 4.5% (-1.2%)
• Expansion Revenue: $12,500 this week

**Highlights:**
✅ Successfully retained 2 at-risk accounts
✅ Closed $25K in expansion deals
✅ Onboarded 3 new enterprise customers
✅ 94% CSAT score this week

**Action Items:**
• Follow up with 6 pending expansion opportunities
• Schedule QBRs for 8 customers next week
• Address 3 open escalations

This report has been automatically saved to your dashboard.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight'
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      content: `I understand you're asking about "${userInput}". Let me analyze your customer data and provide insights.

Based on current trends, I recommend focusing on:
• Customer health monitoring
• Proactive engagement strategies  
• Revenue expansion opportunities

Would you like me to dive deeper into any of these areas?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'insight'
    };
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'insight':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'recommendation':
        return <Target className="w-4 h-4 text-primary" />;
      case 'analysis':
        return <TrendingUp className="w-4 h-4 text-accent" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case 'insight':
        return <Badge variant="secondary" className="text-xs">Insight</Badge>;
      case 'recommendation':
        return <Badge variant="default" className="text-xs">Recommendation</Badge>;
      case 'analysis':
        return <Badge variant="outline" className="text-xs">Analysis</Badge>;
      case 'warning':
        return <Badge variant="destructive" className="text-xs">Alert</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <span>AI Customer Success Assistant</span>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  {message.sender === 'ai' ? (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'ai' && message.type && (
                      <div className="flex items-center space-x-2 mb-2">
                        {getMessageIcon(message.type)}
                        {getMessageBadge(message.type)}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 justify-start text-left"
                    onClick={() => handleSendMessage(suggestion.text)}
                  >
                    <Icon className={`w-3 h-3 mr-2 ${suggestion.color}`} />
                    <span className="text-xs">{suggestion.text}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your customers..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const AIChat = memo(AIChatComponent);
