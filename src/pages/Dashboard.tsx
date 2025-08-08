import React, { useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdvancedStatsCard } from '@/components/dashboard/AdvancedStatsCard';
import { CustomerCard } from '@/components/dashboard/CustomerCard';
import { LazyRevenueChart, LazyCustomerHealthChart } from '@/components/charts/LazyCharts';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomers } from '@/hooks/useCustomers';
import { useActivities } from '@/hooks/useActivities';
// Import only necessary icons to reduce bundle size
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  AlertTriangle,
  CheckCircle,
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

  // Calculate real stats from database data with memoization
  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    atRiskCustomers: customers.filter(c => c.status === 'at-risk').length,
    avgHealthScore: customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + (c.health_score || 0), 0) / customers.length)
      : 0,
    totalRevenue: customers.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0)
  }), [customers]);

  // Get recent activities (last 5) with memoization
  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);

  // Get top customers to display with memoization
  const topCustomers = useMemo(() =>
    customers
      .filter(c => c.status === 'active' || c.status === 'at-risk')
      .sort((a, b) => (b.health_score || 0) - (a.health_score || 0))
      .slice(0, 4),
    [customers]
  );

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
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdvancedStatsCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          description="Active customers"
          icon={Users}
          trend={{ value: 12, label: 'vs last month', positive: true }}
          variant="default"
          progress={{
            value: stats.activeCustomers,
            max: stats.totalCustomers,
            label: "Active customers"
          }}
          chart={{
            data: [45, 52, 48, 61, 58, 65, 72, 69, 74, 81, 78, 86],
            color: "bg-primary"
          }}
        />
        <AdvancedStatsCard
          title="Health Score Avg"
          value={`${stats.avgHealthScore}%`}
          description="Overall customer health"
          icon={TrendingUp}
          trend={{ value: 5, label: 'vs last month', positive: true }}
          variant="success"
          progress={{
            value: stats.avgHealthScore,
            max: 100,
            label: "Health target"
          }}
          chart={{
            data: [65, 68, 72, 70, 75, 78, 74, 79, 82, 85, 83, stats.avgHealthScore],
            color: "bg-accent"
          }}
        />
        <AdvancedStatsCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="Recurring revenue"
          icon={DollarSign}
          trend={{ value: 8, label: 'vs last month', positive: true }}
          variant="default"
          chart={{
            data: [42, 45, 48, 51, 54, 58, 62, 65, 68, 72, 76, 80],
            color: "bg-primary"
          }}
        />
        <AdvancedStatsCard
          title="At-Risk Customers"
          value={stats.atRiskCustomers.toString()}
          description="Need immediate attention"
          icon={AlertTriangle}
          trend={{ value: -15, label: 'vs last month', positive: true }}
          variant="warning"
          progress={{
            value: stats.atRiskCustomers,
            max: Math.max(stats.atRiskCustomers + 10, 20),
            label: "Risk threshold"
          }}
          chart={{
            data: [12, 10, 8, 11, 9, 7, 6, 8, 5, 7, 4, stats.atRiskCustomers],
            color: "bg-orange-500"
          }}
        />
      </div>

      {/* Analytics Dashboard */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activities</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LazyRevenueChart className="lg:col-span-1" />
            <LazyCustomerHealthChart className="lg:col-span-1" />
          </div>
          <ActivityHeatmap />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Management Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            
            {/* Side Panel - Recent Activities */}
            <div className="space-y-6">
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

              {/* AI Insights Panel */}
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
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LazyRevenueChart className="lg:col-span-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdvancedStatsCard
              title="MRR Growth"
              value="+$12,500"
              description="This month"
              icon={TrendingUp}
              trend={{ value: 18.2, label: 'vs last month', positive: true }}
              variant="success"
            />
            <AdvancedStatsCard
              title="Churn Rate"
              value="2.4%"
              description="Monthly churn"
              icon={AlertTriangle}
              trend={{ value: -0.8, label: 'vs last month', positive: true }}
              variant="warning"
            />
            <AdvancedStatsCard
              title="ARPU"
              value="$1,250"
              description="Avg revenue per user"
              icon={DollarSign}
              trend={{ value: 8.5, label: 'vs last month', positive: true }}
              variant="default"
            />
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityHeatmap className="lg:col-span-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Activity Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Weekly calls</span>
                    <Badge variant="outline">15/20</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Follow-ups</span>
                    <Badge variant="outline">8/10</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Check-ins</span>
                    <Badge variant="outline">25/30</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Upcoming Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Customer onboarding call</p>
                    <p className="text-muted-foreground text-xs">Today, 2:00 PM</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Quarterly business review</p>
                    <p className="text-muted-foreground text-xs">Tomorrow, 10:00 AM</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Product demo session</p>
                    <p className="text-muted-foreground text-xs">Friday, 3:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
