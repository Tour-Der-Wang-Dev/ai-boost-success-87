import { lazy, Suspense } from 'react';

// Lazy load chart components to reduce initial bundle size
const RevenueChart = lazy(() => import('../dashboard/RevenueChart').then(module => ({ default: module.RevenueChart })));
const CustomerHealthChart = lazy(() => import('../dashboard/CustomerHealthChart').then(module => ({ default: module.CustomerHealthChart })));

const ChartLoader = () => (
  <div className="flex items-center justify-center h-[300px] w-full bg-gradient-card rounded-lg border">
    <div className="flex flex-col items-center space-y-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="text-sm text-muted-foreground">Loading chart...</span>
    </div>
  </div>
);

export const LazyRevenueChart = (props: any) => (
  <Suspense fallback={<ChartLoader />}>
    <RevenueChart {...props} />
  </Suspense>
);

export const LazyCustomerHealthChart = (props: any) => (
  <Suspense fallback={<ChartLoader />}>
    <CustomerHealthChart {...props} />
  </Suspense>
);
