import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdvancedStatsCard } from '@/components/dashboard/AdvancedStatsCard';
import { CustomerCard } from '@/components/dashboard/CustomerCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CustomerHealthChart } from '@/components/dashboard/CustomerHealthChart';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomers } from '@/hooks/useCustomers';
import { useActivities } from '@/hooks/useActivities';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';


const Dashboard: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();
  const { customers, loading: customersLoading } = useCustomers();
  const { activities, loading: activitiesLoading } = useActivities();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    console.log('Selected customer:', customer);
  };

  // Calculate real stats from database data
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    atRiskCustomers: customers.filter(c => c.status === 'at-risk').length,
    avgHealthScore: customers.length > 0 
      ? Math.round(customers.reduce((sum, c) => sum + (c.health_score || 0), 0) / customers.length)
      : 0,
    totalRevenue: customers.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)
  };

  // Get recent activities (last 5)
  const recentActivities = activities.slice(0, 5);

  // Get top customers to display
  const topCustomers = customers
    .filter(c => c.status === 'active' || c.status === 'at-risk')
    .sort((a, b) => (b.health_score || 0) - (a.health_score || 0))
    .slice(0, 4);

  return (
    <DashboardLayout>
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
          value={stats.totalCustomers.toString()}
          description="Active customers"
          icon={Users}
          trend={{ value: 12, label: 'vs last month', positive: true }}
          variant="default"
        />
        <StatsCard
          title="Health Score Avg"
          value={`${stats.avgHealthScore}%`}
          description="Overall customer health"
          icon={TrendingUp}
          trend={{ value: 5, label: 'vs last month', positive: true }}
          variant="success"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="Recurring revenue"
          icon={DollarSign}
          trend={{ value: 8, label: 'vs last month', positive: true }}
          variant="default"
        />
        <StatsCard
          title="At-Risk Customers"
          value={stats.atRiskCustomers.toString()}
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
              {customersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topCustomers.map((customer) => (
                    <CustomerCard
                      key={customer.id}
                      customer={{
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        company: customer.company || '',
                        status: customer.status as 'active' | 'at-risk' | 'new' | 'churned',
                        healthScore: customer.health_score || 0,
                        lastActivity: customer.last_activity_date || 'No recent activity',
                        revenue: customer.monthly_revenue || 0,
                        growthRate: customer.growth_rate || 0
                      }}
                      onSelect={handleCustomerSelect}
                      onEdit={(customer) => console.log('Edit:', customer)}
                      onMessage={(customer) => console.log('Message:', customer)}
                    />
                  ))}
                  {topCustomers.length === 0 && !customersLoading && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      No customers found. Create your first customer to get started.
                    </div>
                  )}
                </div>
              )}
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
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.status === 'completed' && <CheckCircle className="w-4 h-4 text-accent" />}
                          {activity.status === 'pending' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          {activity.status === 'in-progress' && <TrendingUp className="w-4 h-4 text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.customer?.name || 'Unknown Customer'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentActivities.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent activities found.
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => handleNavigate('/activities')}>
                    View All Activities
                  </Button>
                </>
              )}
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
