import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Star } from 'lucide-react';

const BillingPage: React.FC = () => {
  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const plans = [
    {
      name: 'Basic',
      price: 999,
      period: 'เดือน',
      features: ['ลูกค้าได้ถึง 100 ราย', 'กิจกรรมพื้นฐาน', 'รายงานพื้นฐาน'],
      current: true
    },
    {
      name: 'Pro',
      price: 1999,
      period: 'เดือน',
      features: ['ลูกค้าไม่จำกัด', 'AI Assistant', 'Social Media Integration', 'รายงานขั้นสูง'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 4999,
      period: 'เดือน',
      features: ['ทุกฟีเจอร์ Pro', 'Custom Integration', 'Priority Support', 'White Label']
    }
  ];

  return (
    <DashboardLayout currentPath="/billing" onNavigate={handleNavigate}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground mt-1">
            จัดการแผนการใช้งานและการเรียกเก็บเงิน
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`bg-gradient-card shadow-card border-0 ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.popular && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                {plan.current && <Badge variant="outline">Current Plan</Badge>}
              </div>
              <div className="text-3xl font-bold">
                ฿{plan.price.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-accent" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.current ? "outline" : "default"}>
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Stripe integration จะพัฒนาในเวอร์ชันต่อไป</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BillingPage;