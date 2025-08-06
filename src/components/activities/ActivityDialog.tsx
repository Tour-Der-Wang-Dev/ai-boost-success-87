import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCustomers } from '@/hooks/useCustomers';
import { Activity } from '@/hooks/useActivities';

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  activity?: Activity | null;
  title: string;
}

export const ActivityDialog: React.FC<ActivityDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  activity,
  title
}) => {
  const { customers } = useCustomers();
  const [formData, setFormData] = useState({
    customer_id: '',
    type: 'note' as Activity['type'],
    title: '',
    description: '',
    priority: 'medium' as Activity['priority'],
    due_date: ''
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        customer_id: activity.customer_id || '',
        type: activity.type || 'note',
        title: activity.title || '',
        description: activity.description || '',
        priority: activity.priority || 'medium',
        due_date: activity.due_date ? activity.due_date.slice(0, 16) : ''
      });
    } else {
      setFormData({
        customer_id: '',
        type: 'note',
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      });
    }
  }, [activity, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
    };
    onSubmit(submitData);
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
          <div className="space-y-2">
            <Label htmlFor="customer_id">ลูกค้า *</Label>
            <Select value={formData.customer_id} onValueChange={(value) => handleChange('customer_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกลูกค้า" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} {customer.company && `(${customer.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">ประเภทกิจกรรม</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">โทรศัพท์</SelectItem>
                  <SelectItem value="email">อีเมล</SelectItem>
                  <SelectItem value="meeting">ประชุม</SelectItem>
                  <SelectItem value="note">บันทึก</SelectItem>
                  <SelectItem value="task">งาน</SelectItem>
                  <SelectItem value="milestone">เป้าหมาย</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">ความสำคัญ</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">ต่ำ</SelectItem>
                  <SelectItem value="medium">ปานกลาง</SelectItem>
                  <SelectItem value="high">สูง</SelectItem>
                  <SelectItem value="urgent">เร่งด่วน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">หัวข้อ *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="กรอกหัวข้อกิจกรรม"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="เพิ่มรายละเอียดกิจกรรม..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">กำหนดเสร็จ</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit">
              {activity ? 'อัปเดต' : 'เพิ่มกิจกรรม'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};