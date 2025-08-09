import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Dashboard from './Dashboard';

// Mock the hooks
vi.mock('@/hooks/useCustomers', () => ({
  useCustomers: () => ({
    customers: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        status: 'active',
        health_score: 85,
        monthly_revenue: 5000
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Tech Co',
        status: 'at-risk',
        health_score: 45,
        monthly_revenue: 3000
      }
    ],
    loading: false
  })
}));

vi.mock('@/hooks/useActivities', () => ({
  useActivities: () => ({
    activities: [
      {
        id: '1',
        customer_id: '1',
        type: 'meeting',
        description: 'Quarterly review',
        date: '2024-01-15'
      }
    ],
    loading: false
  })
}));

// Mock router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock lazy components
vi.mock('@/components/charts/LazyCharts', () => ({
  LazyRevenueChart: ({ className }: { className?: string }) => (
    <div data-testid="revenue-chart" className={className}>Revenue Chart</div>
  ),
  LazyCustomerHealthChart: ({ className }: { className?: string }) => (
    <div data-testid="customer-health-chart" className={className}>Customer Health Chart</div>
  )
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard title and description', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Customer Success Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Monitor customer health, track activities, and drive success')).toBeInTheDocument();
  });

  it('displays statistics cards with correct data', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total customers
      expect(screen.getByText('1')).toBeInTheDocument(); // Active customers
      expect(screen.getByText('65')).toBeInTheDocument(); // Average health score
      expect(screen.getByText('$8,000')).toBeInTheDocument(); // Total revenue
    });
  });

  it('renders chart components', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
      expect(screen.getByTestId('customer-health-chart')).toBeInTheDocument();
    });
  });

  it('displays customer cards for top customers', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('has working tab navigation', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      const customersTab = screen.getByRole('tab', { name: /customers/i });
      const revenueTab = screen.getByRole('tab', { name: /revenue/i });
      
      expect(overviewTab).toBeInTheDocument();
      expect(customersTab).toBeInTheDocument();
      expect(revenueTab).toBeInTheDocument();
    });
  });

  it('displays export button', () => {
    render(<Dashboard />);
    
    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('displays refresh button', () => {
    render(<Dashboard />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it('shows loading state when data is loading', () => {
    // Mock loading state
    vi.mocked(require('@/hooks/useCustomers').useCustomers).mockReturnValue({
      customers: [],
      loading: true
    });

    render(<Dashboard />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles empty state when no customers exist', () => {
    // Mock empty state
    vi.mocked(require('@/hooks/useCustomers').useCustomers).mockReturnValue({
      customers: [],
      loading: false
    });

    render(<Dashboard />);
    
    expect(screen.getByText('No customers found')).toBeInTheDocument();
  });
});
