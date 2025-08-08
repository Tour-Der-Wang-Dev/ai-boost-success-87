import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Mail,
  Phone,
  Edit,
  Trash2,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Customer } from '@/hooks/useCustomers';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onMessage: (customer: Customer) => void;
  loading?: boolean;
}

type SortField = 'name' | 'company' | 'health_score' | 'monthly_revenue' | 'last_activity_date' | 'status';
type SortDirection = 'asc' | 'desc';

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
  onMessage,
  loading = false
}) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'company':
        aValue = a.company?.toLowerCase() || '';
        bValue = b.company?.toLowerCase() || '';
        break;
      case 'health_score':
        aValue = a.health_score || 0;
        bValue = b.health_score || 0;
        break;
      case 'monthly_revenue':
        aValue = a.monthly_revenue || 0;
        bValue = b.monthly_revenue || 0;
        break;
      case 'last_activity_date':
        aValue = new Date(a.last_activity_date || 0).getTime();
        bValue = new Date(b.last_activity_date || 0).getTime();
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Active</Badge>;
      case 'at-risk':
        return <Badge variant="destructive">At Risk</Badge>;
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'churned':
        return <Badge variant="outline" className="text-muted-foreground">Churned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-24 h-3 bg-muted rounded animate-pulse" />
                      <div className="w-32 h-2 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><div className="w-20 h-3 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="w-16 h-5 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="w-12 h-3 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="w-16 h-3 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="w-20 h-3 bg-muted rounded animate-pulse" /></TableCell>
                <TableCell><div className="w-8 h-8 bg-muted rounded animate-pulse" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort('name')}
              >
                Customer
                <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort('company')}
              >
                Company
                <SortIcon field="company" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort('status')}
              >
                Status
                <SortIcon field="status" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort('health_score')}
              >
                Health Score
                <SortIcon field="health_score" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort('monthly_revenue')}
              >
                Revenue
                <SortIcon field="monthly_revenue" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort('last_activity_date')}
              >
                Last Activity
                <SortIcon field="last_activity_date" />
              </Button>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCustomers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={customer.avatar_url} alt={customer.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(customer.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{customer.company || '-'}</span>
              </TableCell>
              <TableCell>
                {getStatusBadge(customer.status || '')}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getHealthScoreColor(customer.health_score || 0)}`}>
                      {customer.health_score || 0}%
                    </span>
                    {customer.growth_rate && (
                      <div className="flex items-center">
                        {customer.growth_rate > 0 ? (
                          <TrendingUp className="w-3 h-3 text-accent" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                  <Progress 
                    value={customer.health_score || 0} 
                    className="h-1 w-16"
                  />
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  ${(customer.monthly_revenue || 0).toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">/month</p>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {customer.last_activity_date 
                    ? new Date(customer.last_activity_date).toLocaleDateString()
                    : 'No activity'
                  }
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMessage(customer)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDelete(customer.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
