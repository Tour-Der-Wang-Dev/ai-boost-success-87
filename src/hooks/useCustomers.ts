import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  status: string;
  health_score: number | null;
  monthly_revenue: number | null;
  growth_rate: number | null;
  last_activity_date?: string | null;
  assigned_agent_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCustomers((data || []) as Customer[]);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลลูกค้าได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new customer
  const createCustomer = async (customerData: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    status?: string;
    health_score?: number;
    monthly_revenue?: number;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          email: customerData.email,
          company: customerData.company || null,
          phone: customerData.phone || null,
          status: customerData.status || 'new',
          health_score: customerData.health_score || 50,
          monthly_revenue: customerData.monthly_revenue || 0,
          growth_rate: 0,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCustomers(prev => [data as Customer, ...prev]);
      
      toast({
        title: "สำเร็จ",
        description: "เพิ่มลูกค้าใหม่เรียบร้อยแล้ว",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating customer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มลูกค้าได้",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Update a customer
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCustomers(prev => 
        prev.map(customer => 
          customer.id === id ? { ...customer, ...data } : customer
        )
      );

      toast({
        title: "สำเร็จ",
        description: "อัพเดทข้อมูลลูกค้าเรียบร้อยแล้ว",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทข้อมูลลูกค้าได้",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Delete a customer
  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      toast({
        title: "สำเร็จ",
        description: "ลบข้อมูลลูกค้าเรียบร้อยแล้ว",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลลูกค้าได้",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Search customers
  const searchCustomers = async (query: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${query}%, email.ilike.%${query}%, company.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers((data || []) as Customer[]);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error searching customers:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Get customers by status
  const getCustomersByStatus = async (status: Customer['status']) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching customers by status:', error);
      return { data: null, error };
    }
  };

  // Calculate customer stats
  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const atRisk = customers.filter(c => c.status === 'at-risk').length;
    const churned = customers.filter(c => c.status === 'churned').length;
    const newCustomers = customers.filter(c => c.status === 'new').length;
    
    const totalRevenue = customers.reduce((sum, c) => sum + c.monthly_revenue, 0);
    const avgHealthScore = total > 0 
      ? customers.reduce((sum, c) => sum + c.health_score, 0) / total 
      : 0;

    return {
      total,
      active,
      atRisk,
      churned,
      newCustomers,
      totalRevenue,
      avgHealthScore: Math.round(avgHealthScore)
    };
  };

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  return {
    customers,
    loading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomersByStatus,
    getCustomerStats,
  };
};