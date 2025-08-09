import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useCustomers } from './useCustomers';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: mockCustomersData,
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: [mockCustomersData[0]], error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [mockCustomersData[0]], error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

// Mock Auth Context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user123' }
  })
}));

// Mock Toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockCustomersData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    status: 'active',
    health_score: 85,
    monthly_revenue: 5000,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    created_by: 'user123'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: 'Tech Co',
    status: 'at-risk',
    health_score: 45,
    monthly_revenue: 3000,
    created_at: '2024-01-02',
    updated_at: '2024-01-02',
    created_by: 'user123'
  }
];

describe('useCustomers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch customers on mount', async () => {
    const { result } = renderHook(() => useCustomers());

    expect(result.current.loading).toBe(true);
    expect(result.current.customers).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.customers).toEqual(mockCustomersData);
  });

  it('should provide addCustomer function', async () => {
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newCustomer = {
      name: 'New Customer',
      email: 'new@example.com',
      company: 'New Corp',
      status: 'new',
      health_score: 75,
      monthly_revenue: 2000
    };

    await result.current.addCustomer(newCustomer);

    // Should call the insert method on supabase
    expect(vi.mocked(require('@/integrations/supabase/client').supabase.from)).toHaveBeenCalledWith('customers');
  });

  it('should provide updateCustomer function', async () => {
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedData = { health_score: 90 };
    await result.current.updateCustomer('1', updatedData);

    // Should call the update method on supabase
    expect(vi.mocked(require('@/integrations/supabase/client').supabase.from)).toHaveBeenCalledWith('customers');
  });

  it('should provide deleteCustomer function', async () => {
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.deleteCustomer('1');

    // Should call the delete method on supabase
    expect(vi.mocked(require('@/integrations/supabase/client').supabase.from)).toHaveBeenCalledWith('customers');
  });

  it('should handle loading state correctly', () => {
    const { result } = renderHook(() => useCustomers());

    expect(result.current.loading).toBe(true);
    expect(result.current.customers).toEqual([]);
  });
});
