import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface CustomerFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  selectedStatus,
  onStatusChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="w-4 h-4 text-muted-foreground" />
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="เลือกสถานะ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทุกสถานะ</SelectItem>
          <SelectItem value="new">ลูกค้าใหม่</SelectItem>
          <SelectItem value="active">ลูกค้าปกติ</SelectItem>
          <SelectItem value="at-risk">เสี่ยงสูญเสีย</SelectItem>
          <SelectItem value="churned">สูญเสียแล้ว</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};