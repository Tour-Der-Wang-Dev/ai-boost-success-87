import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Activity {
  id: string;
  customer_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'milestone';
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed_at?: string;
  created_by: string;
  assigned_to?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  // Join data
  customer?: {
    name: string;
    email: string;
    company?: string;
  };
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
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

      setActivities((data || []) as Activity[]);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลกิจกรรมได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new activity
  const createActivity = async (activityData: {
    customer_id: string;
    type: Activity['type'];
    title: string;
    description?: string;
    priority?: Activity['priority'];
    due_date?: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          customer_id: activityData.customer_id,
          type: activityData.type,
          title: activityData.title,
          description: activityData.description || '',
          priority: activityData.priority || 'medium',
          due_date: activityData.due_date || null,
          status: 'pending',
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

      setActivities(prev => [data as Activity, ...prev]);
      
      toast({
        title: "สำเร็จ",
        description: "เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating activity:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มกิจกรรมได้",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Update an activity
  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
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

      setActivities(prev => 
        prev.map(activity => 
          activity.id === id ? { ...activity, ...data as Activity } : activity
        )
      );

      toast({
        title: "สำเร็จ",
        description: "อัพเดทกิจกรรมเรียบร้อยแล้ว",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating activity:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทกิจกรรมได้",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Delete an activity
  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActivities(prev => prev.filter(activity => activity.id !== id));
      
      toast({
        title: "สำเร็จ",
        description: "ลบกิจกรรมเรียบร้อยแล้ว",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบกิจกรรมได้",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Get activities by customer
  const getActivitiesByCustomer = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('activities')
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
      console.error('Error fetching customer activities:', error);
      return { data: null, error };
    }
  };

  // Get activities by status
  const getActivitiesByStatus = async (status: Activity['status']) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          customers (
            name,
            email,
            company
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching activities by status:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  return {
    activities,
    loading,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByCustomer,
    getActivitiesByStatus,
  };
};