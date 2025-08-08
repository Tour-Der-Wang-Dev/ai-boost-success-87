import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { CustomerCard } from './CustomerCard';

const mockCustomer = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  status: 'active' as const,
  healthScore: 85,
  lastActivity: '2 days ago',
  monthlyRevenue: 5000,
  tags: ['Enterprise', 'High-Value']
};

describe('CustomerCard', () => {
  it('renders customer information correctly', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('displays health score with correct styling', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    const healthScore = screen.getByText('85');
    expect(healthScore).toBeInTheDocument();
  });

  it('shows correct status badge for active customer', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    const statusBadge = screen.getByText('Active');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-accent');
  });

  it('shows correct status badge for at-risk customer', () => {
    const atRiskCustomer = { ...mockCustomer, status: 'at-risk' as const };
    render(<CustomerCard customer={atRiskCustomer} />);
    
    const statusBadge = screen.getByText('At Risk');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-orange-500');
  });

  it('displays avatar with fallback initials', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    const avatar = screen.getByText('JD');
    expect(avatar).toBeInTheDocument();
  });

  it('calls onMessage when message button is clicked', () => {
    const onMessage = vi.fn();
    render(<CustomerCard customer={mockCustomer} onMessage={onMessage} />);
    
    const messageButton = screen.getByRole('button', { name: /message/i });
    fireEvent.click(messageButton);
    
    expect(onMessage).toHaveBeenCalledWith(mockCustomer);
  });

  it('calls onCall when call button is clicked', () => {
    const onCall = vi.fn();
    render(<CustomerCard customer={mockCustomer} onCall={onCall} />);
    
    const callButton = screen.getByRole('button', { name: /call/i });
    fireEvent.click(callButton);
    
    expect(onCall).toHaveBeenCalledWith(mockCustomer);
  });

  it('calls onEmail when email button is clicked', () => {
    const onEmail = vi.fn();
    render(<CustomerCard customer={mockCustomer} onEmail={onEmail} />);
    
    const emailButton = screen.getByRole('button', { name: /email/i });
    fireEvent.click(emailButton);
    
    expect(onEmail).toHaveBeenCalledWith(mockCustomer);
  });

  it('renders tags when provided', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('High-Value')).toBeInTheDocument();
  });

  it('displays monthly revenue when provided', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('applies hover effects and animations', () => {
    render(<CustomerCard customer={mockCustomer} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('transition-all');
  });
});
