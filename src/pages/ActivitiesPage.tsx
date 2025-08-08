import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ActivityCard } from '@/components/activities/ActivityCard';
import { ActivityDialog } from '@/components/activities/ActivityDialog';
import { ActivityTimeline } from '@/components/activities/ActivityTimeline';
import { ActivityKanban } from '@/components/activities/ActivityKanban';
import { useActivities } from '@/hooks/useActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  List,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Target
} from 'lucide-react';

const ActivitiesPage: React.FC = () => {
  const { activities, loading, createActivity, updateActivity, deleteActivity } = useActivities();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleCreateActivity = async (activityData: any) => {
    const result = await createActivity(activityData);
    if (!result.error) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditActivity = async (activityData: any) => {
    if (selectedActivity) {
      const result = await updateActivity(selectedActivity.id, activityData);
      if (!result.error) {
        setIsEditDialogOpen(false);
        setSelectedActivity(null);
      }
    }
  };

  const openEditDialog = (activity: any) => {
    setSelectedActivity(activity);
    setIsEditDialogOpen(true);
  };

  const filteredActivities = activities.filter(activity => {
    if (selectedType !== 'all' && activity.type !== selectedType) return false;
    if (selectedStatus !== 'all' && activity.status !== selectedStatus) return false;
    if (searchQuery) {
      return activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getStatusStats = () => {
    return {
      pending: activities.filter(a => a.status === 'pending').length,
      inProgress: activities.filter(a => a.status === 'in-progress').length,
      completed: activities.filter(a => a.status === 'completed').length,
      cancelled: activities.filter(a => a.status === 'cancelled').length,
    };
  };

  const stats = getStatusStats();

  return (
    <DashboardLayout currentPath="/activities" onNavigate={handleNavigate}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Activities Management
          </h1>
          <p className="text-muted-foreground mt-1">
            ติดตามและจัดการกิจกรรมทั้งหมด
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มกิจกรรมใหม่
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">รอดำเนินการ</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">กำลังดำเนินการ</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">เสร็จสิ้น</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.cancelled}</div>
                <div className="text-sm text-muted-foreground">ยกเลิก</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="ค้นหากิจกรรม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ประเภท" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกประเภท</SelectItem>
            <SelectItem value="call">โทรศัพท์</SelectItem>
            <SelectItem value="email">อีเมล</SelectItem>
            <SelectItem value="meeting">ประชุม</SelectItem>
            <SelectItem value="note">บันทึก</SelectItem>
            <SelectItem value="task">งาน</SelectItem>
            <SelectItem value="milestone">เป้าหมาย</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="pending">รอดำเนินการ</SelectItem>
            <SelectItem value="in-progress">กำลังดำเนินการ</SelectItem>
            <SelectItem value="completed">เสร็จสิ้น</SelectItem>
            <SelectItem value="cancelled">ยกเลิก</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activities Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">รายการ</TabsTrigger>
          <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>กิจกรรมทั้งหมด ({filteredActivities.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">กำลังโหลด...</p>
                </div>
              ) : filteredActivities.length > 0 ? (
                <div className="space-y-3">
                  {filteredActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onEdit={() => openEditDialog(activity)}
                      onDelete={() => deleteActivity(activity.id)}
                      onStatusUpdate={(status) => updateActivity(activity.id, { status })}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">ไม่พบกิจกรรม</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'ไม่พบกิจกรรมที่ตรงกับการค้นหา' : 'ยังไม่มีกิจกรรมในระบบ'}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มกิจกรรมแรก
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Calendar integration จะพัฒนาในเวอร์ชันต่อไป
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ActivityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateActivity}
        title="เพิ่มกิจกรรมใหม่"
      />

      <ActivityDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditActivity}
        activity={selectedActivity}
        title="แก้ไขกิจกรรม"
      />
    </DashboardLayout>
  );
};

export default ActivitiesPage;
