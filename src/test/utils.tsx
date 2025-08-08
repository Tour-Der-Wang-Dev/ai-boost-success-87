import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// For components that already have routing, provide a version without router
const ProvidersWithoutRouter = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

const customRenderWithoutRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: ProvidersWithoutRouter, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, customRenderWithoutRouter as renderWithoutRouter };

// Mock data for testing
export const mockCustomer = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  status: 'active' as const,
  health_score: 85,
  monthly_revenue: 5000,
  last_activity_date: '2024-01-15',
  created_at: '2024-01-01',
  updated_at: '2024-01-15'
};

export const mockActivity = {
  id: '1',
  customer_id: '1',
  type: 'meeting',
  description: 'Quarterly business review',
  date: '2024-01-15',
  created_at: '2024-01-15',
  outcome: 'positive'
};

export const mockInsight = {
  id: '1',
  content: 'Customer engagement is trending upward',
  type: 'insight' as const,
  created_at: '2024-01-15'
};
