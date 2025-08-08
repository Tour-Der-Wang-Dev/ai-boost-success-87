import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/hooks/useCustomers';

interface CustomerSegmentsProps {
  customers: Customer[];
}

export const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ customers }) => {
  const highValueCustomers = customers.filter(c => (c.monthly_revenue || 0) > 2000);
  const growthCustomers = customers.filter(c => (c.growth_rate || 0) > 0);
  const needsAttentionCustomers = customers.filter(c => (c.health_score || 0) < 50);

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle>Customer Segments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-accent/5 border-accent/20">
            <h3 className="font-medium text-accent">High Value</h3>
            <p className="text-sm text-muted-foreground">Revenue &gt; $2000/month</p>
            <div className="text-2xl font-bold mt-2">
              {highValueCustomers.length}
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
            <h3 className="font-medium text-primary">Growth</h3>
            <p className="text-sm text-muted-foreground">Health score improving</p>
            <div className="text-2xl font-bold mt-2">
              {growthCustomers.length}
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
            <h3 className="font-medium text-orange-600">Needs Attention</h3>
            <p className="text-sm text-muted-foreground">Health score &lt; 50%</p>
            <div className="text-2xl font-bold mt-2">
              {needsAttentionCustomers.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
