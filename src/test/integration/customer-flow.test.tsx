import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithoutRouter, screen, fireEvent, waitFor } from '@/test/utils';
import App from '@/App';

// Mock all external dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({
        data: { session: { user: { id: 'user123', email: 'test@example.com' } } },
        error: null
      }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({
            data: [
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
              }
            ],
            error: null
          })
        })
      })
    })
  }
}));

// Mock lazy loaded components
vi.mock('@/components/charts/LazyCharts', () => ({
  LazyRevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
  LazyCustomerHealthChart: () => <div data-testid="customer-health-chart">Customer Health Chart</div>
}));

describe('Customer Management Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow navigation through customer management features', async () => {
    render(<App />);

    // Wait for authentication and data loading
    await waitFor(() => {
      expect(screen.getByText('Customer Success Dashboard')).toBeInTheDocument();
    });

    // Should display customer data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Navigate to customers page
    const customersLink = screen.getByRole('link', { name: /customers/i });
    fireEvent.click(customersLink);

    // Should navigate to customers page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/customers');
    });
  });

  it('should display dashboard statistics correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Customer Success Dashboard')).toBeInTheDocument();
    });

    // Check if statistics are calculated and displayed
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Total customers
    });
  });

  it('should handle loading states gracefully', async () => {
    render(<App />);

    // Should show loading spinner initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Customer Success Dashboard')).toBeInTheDocument();
    });
  });

  it('should render charts when dashboard loads', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
      expect(screen.getByTestId('customer-health-chart')).toBeInTheDocument();
    });
  });
});
