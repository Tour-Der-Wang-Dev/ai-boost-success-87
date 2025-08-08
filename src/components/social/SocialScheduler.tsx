import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  Plus,
  Image,
  Hash,
  MapPin,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'scheduled' | 'published' | 'failed';
  mediaUrl?: string;
  hashtags?: string[];
  location?: string;
}

interface SocialSchedulerProps {
  onSchedulePost?: (post: Omit<ScheduledPost, 'id' | 'status'>) => void;
}

export const SocialScheduler: React.FC<SocialSchedulerProps> = ({ onSchedulePost }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [includeImage, setIncludeImage] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const platforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600',
      maxLength: 63206,
      features: ['text', 'image', 'video', 'location']
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'text-sky-500',
      maxLength: 280,
      features: ['text', 'image', 'hashtags']
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'text-blue-700',
      maxLength: 3000,
      features: ['text', 'image', 'document']
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'text-pink-600',
      maxLength: 2200,
      features: ['image', 'text', 'hashtags', 'location']
    },
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedulePost = () => {
    if (!content.trim() || selectedPlatforms.length === 0 || !scheduledDate) {
      return;
    }

    const [hours, minutes] = scheduledTime.split(':');
    const fullScheduledTime = new Date(scheduledDate);
    fullScheduledTime.setHours(parseInt(hours), parseInt(minutes));

    const hashtagsArray = hashtags.split(',').map(tag => tag.trim()).filter(Boolean);

    onSchedulePost?.({
      content,
      platforms: selectedPlatforms,
      scheduledTime: fullScheduledTime,
      hashtags: hashtagsArray,
      location: location || undefined,
      mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined
    });

    // Reset form
    setContent('');
    setSelectedPlatforms([]);
    setScheduledDate(undefined);
    setScheduledTime('12:00');
    setHashtags('');
    setLocation('');
    setIncludeImage(false);
    setMediaFile(null);
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return null;
    const limits = selectedPlatforms.map(platformId => 
      platforms.find(p => p.id === platformId)?.maxLength || Infinity
    );
    return Math.min(...limits);
  };

  const characterLimit = getCharacterLimit();
  const isOverLimit = characterLimit && content.length > characterLimit;

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-primary" />
          <span>Schedule Social Media Post</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Platforms</Label>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);
              
              return (
                <div 
                  key={platform.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-background border-border hover:border-primary/40'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <Icon className={`w-5 h-5 ${platform.color}`} />
                  <span className="font-medium">{platform.name}</span>
                  {isSelected && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Post Content</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening? Share your customer success story..."
            rows={4}
            className={isOverLimit ? 'border-destructive' : ''}
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {characterLimit && (
                <span className={isOverLimit ? 'text-destructive' : ''}>
                  {content.length}/{characterLimit} characters
                </span>
              )}
            </span>
            <div className="flex items-center space-x-2">
              {selectedPlatforms.map(platformId => {
                const platform = platforms.find(p => p.id === platformId);
                if (!platform) return null;
                const Icon = platform.icon;
                return (
                  <Icon key={platformId} className={`w-4 h-4 ${platform.color}`} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Media Attachment</Label>
            <Switch
              checked={includeImage}
              onCheckedChange={setIncludeImage}
            />
          </div>
          {includeImage && (
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
              />
              {mediaFile && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Image className="w-4 h-4" />
                  <span>{mediaFile.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Hash className="w-4 h-4" />
            <span>Hashtags</span>
          </Label>
          <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="customerSuccess, SaaS, growth (comma separated)"
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple hashtags with commas
          </p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Location (optional)</span>
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="New York, NY"
          />
        </div>

        {/* Schedule Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Schedule Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Schedule Time</Label>
            <Select value={scheduledTime} onValueChange={setScheduledTime}>
              <SelectTrigger>
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handleSchedulePost}
            disabled={!content.trim() || selectedPlatforms.length === 0 || !scheduledDate || isOverLimit}
            className="flex-1"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
          <Button variant="outline">
            <Send className="w-4 h-4 mr-2" />
            Post Now
          </Button>
        </div>

        {/* Preview */}
        {content && selectedPlatforms.length > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Preview</Label>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-sm">{content}</p>
              {hashtags && (
                <div className="flex flex-wrap gap-1">
                  {hashtags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
              {location && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{location}</span>
                </div>
              )}
              {scheduledDate && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Scheduled for {format(scheduledDate, "PPP")} at {scheduledTime}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
