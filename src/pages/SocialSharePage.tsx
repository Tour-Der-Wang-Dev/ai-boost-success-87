import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Share2, Facebook, Twitter, Linkedin, Instagram, Send } from 'lucide-react';

const SocialSharePage: React.FC = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  ];

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleShare = () => {
    console.log('Sharing:', { content, platforms: selectedPlatforms });
    // Ayrshare integration would go here
  };

  return (
    <DashboardLayout currentPath="/social-share" onNavigate={handleNavigate}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Social Share
          </h1>
          <p className="text-muted-foreground mt-1">
            แชร์เนื้อหาไปยัง Social Media ผ่าน Ayrshare
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-primary" />
              <span>สร้างโพสต์</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">เนื้อหาโพสต์</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="เขียนเนื้อหาที่ต้องการแชร์..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">เลือกแพลตฟอร์ม</label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.id} className="flex items-center space-x-2 p-3 rounded-lg border bg-background">
                      <Checkbox
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                      <Icon className={`w-5 h-5 ${platform.color}`} />
                      <span className="font-medium">{platform.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={handleShare}
              disabled={!content.trim() || selectedPlatforms.length === 0}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              แชร์โพสต์
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>โพสต์ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ยังไม่มีโพสต์ที่แชร์</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SocialSharePage;