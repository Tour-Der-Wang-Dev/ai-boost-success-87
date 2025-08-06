import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Customer } from '@/hooks/useCustomers';

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  customer?: Customer | null;
  title: string;
}

export const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  customer,
  title
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'new',
    health_score: 50,
    monthly_revenue: 0,
    notes: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        company: customer.company || '',
        phone: customer.phone || '',
        status: customer.status || 'new',
        health_score: customer.health_score || 50,
        monthly_revenue: customer.monthly_revenue || 0,
        notes: customer.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        status: 'new',
        health_score: 50,
        monthly_revenue: 0,
        notes: ''
      });
    }
  }, [customer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อลูกค้า *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="กรอกชื่อลูกค้า"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="กรอกอีเมล"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">บริษัท</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="กรอกชื่อบริษัท"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="กรอกเบอร์โทร"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">สถานะ</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">ลูกค้าใหม่</SelectItem>
                  <SelectItem value="active">ลูกค้าปกติ</SelectItem>
                  <SelectItem value="at-risk">เสี่ยงสูญเสีย</SelectItem>
                  <SelectItem value="churned">สูญเสียแล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="health_score">คะแนนสุขภาพ (0-100)</Label>
              <Input
                id="health_score"
                type="number"
                min="0"
                max="100"
                value={formData.health_score}
                onChange={(e) => handleChange('health_score', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly_revenue">รายได้ต่อเดือน (บาท)</Label>
            <Input
              id="monthly_revenue"
              type="number"
              min="0"
              value={formData.monthly_revenue}
              onChange={(e) => handleChange('monthly_revenue', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">หมายเหตุ</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="เพิ่มหมายเหตุเกี่ยวกับลูกค้า..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit">
              {customer ? 'อัปเดต' : 'เพิ่มลูกค้า'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};