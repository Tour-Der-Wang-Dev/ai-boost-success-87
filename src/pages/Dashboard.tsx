import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CustomerCard } from '@/components/dashboard/CustomerCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Plus,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Mock data - in real app this would come from your backend
const mockCustomers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp Inc.',
    status: 'active' as const,
    healthScore: 92,
    lastActivity: '2 hours ago',
    revenue: 15000,
    growthRate: 12
  },
  {
    id: '2', 
    name: 'Michael Chen',
    email: 'michael@innovate.co',
    company: 'Innovate Solutions',
    status: 'at-risk' as const,
    healthScore: 45,
    lastActivity: '5 days ago',
    revenue: 8500,
    growthRate: -8
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@startup.io',
    company: 'Startup.io',
    status: 'new' as const,
    healthScore: 78,
    lastActivity: '1 hour ago',
    revenue: 3200,
    growthRate: 25
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@enterprise.com',
    company: 'Enterprise Solutions',
    status: 'active' as const,
    healthScore: 87,
    lastActivity: '30 minutes ago',
    revenue: 25000,
    growthRate: 5
  }
];

const recentActivities = [
  {
    id: '1',
    type: 'meeting',
    customer: 'Sarah Johnson',
    action: 'Completed onboarding call',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    type: 'alert',
    customer: 'Michael Chen',
    action: 'Health score dropped below 50%',
    time: '1 day ago',
    status: 'urgent'
  },
  {
    id: '3',
    type: 'success',
    customer: 'Emily Rodriguez',
    action: 'Upgraded to Pro plan',
    time: '3 hours ago',
    status: 'positive'
  }
];

const Dashboard: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
    // In a real app, you'd use router navigation here
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    console.log('Selected customer:', customer);
  };

  return (
    <DashboardLayout currentPath="/" onNavigate={handleNavigate}>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Customer Success Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor customer health, track activities, and drive success
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value="248"
          description="Active customers"
          icon={Users}
          trend={{ value: 12, label: 'vs last month', positive: true }}
          variant="default"
        />
        <StatsCard
          title="Health Score Avg"
          value="78%"
          description="Overall customer health"
          icon={TrendingUp}
          trend={{ value: 5, label: 'vs last month', positive: true }}
          variant="success"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$127,500"
          description="Recurring revenue"
          icon={DollarSign}
          trend={{ value: 8, label: 'vs last month', positive: true }}
          variant="default"
        />
        <StatsCard
          title="At-Risk Customers"
          value="12"
          description="Need immediate attention"
          icon={AlertTriangle}
          trend={{ value: 3, label: 'vs last month', positive: false }}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Key Customers</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleNavigate('/customers')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onSelect={handleCustomerSelect}
                    onEdit={(customer) => console.log('Edit:', customer)}
                    onMessage={(customer) => console.log('Message:', customer)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.status === 'completed' && <CheckCircle className="w-4 h-4 text-accent" />}
                      {activity.status === 'urgent' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                      {activity.status === 'positive' && <TrendingUp className="w-4 h-4 text-accent" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.customer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => handleNavigate('/activities')}>
                View All Activities
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-primary border-0 text-primary-foreground">
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Get intelligent recommendations to improve customer success
              </p>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => handleNavigate('/ai-assistant')}>
                  Generate Insights
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Schedule Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;