import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CustomerCard } from '@/components/dashboard/CustomerCard';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { CustomerDialog } from '@/components/customers/CustomerDialog';
import { CustomerFilters } from '@/components/customers/CustomerFilters';
import { CustomerImportDialog } from '@/components/customers/CustomerImportDialog';
import { CustomerSegments } from '@/components/customers/CustomerSegments';
import { useCustomers, Customer } from '@/hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Users,
  Upload,
  Grid3X3,
  Table,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const CustomersPage: React.FC = () => {
  const { 
    customers, 
    loading, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    searchCustomers,
    getCustomerStats
  } = useCustomers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { toast } = useToast();

  const stats = getCustomerStats();

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchCustomers(query);
    } else {
      // Fetch all customers if search is empty
      window.location.reload();
    }
  };

  const handleCreateCustomer = async (customerData: any) => {
    const result = await createCustomer(customerData);
    if (!result.error) {
      setIsCreateDialogOpen(false);
      toast({
        title: "สำเร็จ",
        description: "เพิ่มลูกค้าใหม่เรียบร้อยแล้ว",
      });
    }
  };

  const handleEditCustomer = async (customerData: any) => {
    if (selectedCustomer) {
      const result = await updateCustomer(selectedCustomer.id, customerData);
      if (!result.error) {
        setIsEditDialogOpen(false);
        setSelectedCustomer(null);
        toast({
          title: "สำเร็จ",
          description: "แก้ไขข้อมูลลูกค้าเรียบร้อยแล้ว",
        });
      }
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const result = await deleteCustomer(customerId);
    if (!result.error) {
      toast({
        title: "สำเร็จ",
        description: "ลบลูกค้าเรียบร้อยแล้ว",
      });
    }
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleImportCustomers = async (data: any[]) => {
    // Process the imported data
    for (const customerData of data) {
      await createCustomer({
        name: customerData.name || '',
        email: customerData.email || '',
        company: customerData.company || '',
        phone: customerData.phone || '',
        status: customerData.status || 'new',
        health_score: customerData.health_score || 0,
        monthly_revenue: customerData.monthly_revenue || 0
      });
    }
    
    toast({
      title: "Import Successful",
      description: `Successfully imported ${data.length} customers.`,
    });
  };

  const handleExportCustomers = () => {
    const csvContent = [
      'name,email,company,phone,status,health_score,monthly_revenue,last_activity_date',
      ...filteredCustomers.map(customer => 
        `"${customer.name || ''}","${customer.email || ''}","${customer.company || ''}","${customer.phone || ''}","${customer.status || ''}",${customer.health_score || 0},${customer.monthly_revenue || 0},"${customer.last_activity_date || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredCustomers.length} customers to CSV.`,
    });
  };

  const filteredCustomers = customers.filter(customer => {
    if (selectedStatus !== 'all' && customer.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout currentPath="/customers" onNavigate={handleNavigate}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            จัดการและติดตามลูกค้าทั้งหมด - {filteredCustomers.length} customers
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleExportCustomers}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มลูกค้าใหม่
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">ลูกค้าทั้งหมด</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.active}</div>
              <div className="text-sm text-muted-foreground">ลูกค้าปกติ</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.atRisk}</div>
              <div className="text-sm text-muted-foreground">เสี่ยงสูญเสีย</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.newCustomers}</div>
              <div className="text-sm text-muted-foreground">ลูกค้าใหม่</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.avgHealthScore}%</div>
              <div className="text-sm text-muted-foreground">คะแนนเฉลี่ย</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter and View Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="ค้นหาลูกค้า..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <CustomerFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Customer Analytics Tabs */}
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Customers ({filteredCustomers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Segments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>ลูกค้าทั้งหมด ({filteredCustomers.length})</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {viewMode === 'grid' ? 'Grid View' : 'Table View'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">กำลังโหลด...</p>
                </div>
              ) : filteredCustomers.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCustomers.map((customer) => (
                        <CustomerCard
                          key={customer.id}
                          customer={{
                            id: customer.id,
                            name: customer.name,
                            email: customer.email,
                            company: customer.company || '',
                            avatar: customer.avatar_url,
                            status: customer.status as any,
                            healthScore: customer.health_score || 0,
                            lastActivity: customer.last_activity_date || 'ไม่มีข้อมูล',
                            revenue: customer.monthly_revenue || 0,
                            growthRate: customer.growth_rate
                          }}
                          onSelect={(customer) => console.log('Selected:', customer)}
                          onEdit={() => openEditDialog(customer)}
                          onMessage={(customer) => console.log('Message:', customer)}
                        />
                      ))}
                    </div>
                  ) : (
                    <CustomerTable
                      customers={filteredCustomers}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteCustomer}
                      onMessage={(customer) => console.log('Message:', customer)}
                      loading={loading}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">ไม่พบลูกค้า</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'ไม่พบลูกค้าที่ตรงกับการค้นหา' : 'ยั��ไม่มีลูกค้าในระบบ'}
                  </p>
                  <div className="flex space-x-2 justify-center">
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มลูกค้าแรก
                    </Button>
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import ลูกค้า
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.active}</div>
                    <div className="text-sm text-muted-foreground">Active Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.atRisk}</div>
                    <div className="text-sm text-muted-foreground">At Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.newCustomers}</div>
                    <div className="text-sm text-muted-foreground">New Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.avgHealthScore}%</div>
                    <div className="text-sm text-muted-foreground">Avg Health Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Customer Distribution by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: 'active', count: stats.active, color: 'bg-accent' },
                  { status: 'at-risk', count: stats.atRisk, color: 'bg-orange-500' },
                  { status: 'new', count: stats.newCustomers, color: 'bg-primary' },
                  { status: 'churned', count: stats.total - stats.active - stats.atRisk - stats.newCustomers, color: 'bg-muted' }
                ].map(({ status, count, color }) => (
                  <div key={status} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${color}`} />
                    <span className="capitalize text-sm font-medium w-20">{status}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <CustomerSegments customers={customers} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CustomerDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateCustomer}
        title="เพิ่มลูกค้าใหม่"
      />

      <CustomerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditCustomer}
        customer={selectedCustomer}
        title="แก้ไขข้อมูลลูกค้า"
      />

      <CustomerImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportCustomers}
      />
    </DashboardLayout>
  );
};

export default CustomersPage;
