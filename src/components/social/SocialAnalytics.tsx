import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  Target,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

interface SocialAnalyticsProps {
  className?: string;
}

const engagementData = [
  { date: 'Mon', facebook: 120, twitter: 89, linkedin: 45, instagram: 156 },
  { date: 'Tue', facebook: 145, twitter: 92, linkedin: 52, instagram: 178 },
  { date: 'Wed', facebook: 167, twitter: 98, linkedin: 61, instagram: 189 },
  { date: 'Thu', facebook: 134, twitter: 105, linkedin: 58, instagram: 201 },
  { date: 'Fri', facebook: 178, twitter: 87, linkedin: 67, instagram: 234 },
  { date: 'Sat', facebook: 189, twitter: 76, linkedin: 43, instagram: 267 },
  { date: 'Sun', facebook: 156, twitter: 82, linkedin: 39, instagram: 245 }
];

const platformData = [
  { name: 'Facebook', followers: 2840, engagement: 5.6, posts: 23, color: '#1877F2' },
  { name: 'Twitter', followers: 1920, engagement: 3.8, posts: 45, color: '#1DA1F2' },
  { name: 'LinkedIn', followers: 1340, engagement: 7.2, posts: 12, color: '#0A66C2' },
  { name: 'Instagram', followers: 3560, engagement: 8.4, posts: 34, color: '#E4405F' }
];

const topPosts = [
  {
    id: '1',
    content: 'How we helped TechCorp increase their customer retention by 40% in just 3 months! 🚀',
    platform: 'linkedin',
    likes: 247,
    comments: 32,
    shares: 18,
    reach: 5420,
    date: '2024-01-15'
  },
  {
    id: '2',
    content: '5 Customer Success Metrics Every SaaS Company Should Track 📊',
    platform: 'twitter',
    likes: 189,
    comments: 28,
    shares: 34,
    reach: 3890,
    date: '2024-01-14'
  },
  {
    id: '3',
    content: 'Customer success story: From churn risk to expansion opportunity ⭐',
    platform: 'facebook',
    likes: 156,
    comments: 19,
    shares: 12,
    reach: 2340,
    date: '2024-01-13'
  }
];

export const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({ className = "" }) => {
  const totalFollowers = platformData.reduce((sum, platform) => sum + platform.followers, 0);
  const avgEngagement = platformData.reduce((sum, platform) => sum + platform.engagement, 0) / platformData.length;
  const totalPosts = platformData.reduce((sum, platform) => sum + platform.posts, 0);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-sky-500" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-700" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatNumber(totalFollowers)}</div>
                <div className="text-sm text-muted-foreground">Total Followers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <div className="text-sm text-muted-foreground">Posts This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">47.2K</div>
                <div className="text-sm text-muted-foreground">Total Reach</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Weekly Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="facebook" 
                    stroke="#1877F2" 
                    strokeWidth={2}
                    name="Facebook"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="twitter" 
                    stroke="#1DA1F2" 
                    strokeWidth={2}
                    name="Twitter"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="linkedin" 
                    stroke="#0A66C2" 
                    strokeWidth={2}
                    name="LinkedIn"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="instagram" 
                    stroke="#E4405F" 
                    strokeWidth={2}
                    name="Instagram"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformData.map((platform) => (
                <div key={platform.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(platform.name.toLowerCase())}
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatNumber(platform.followers)} followers</div>
                      <div className="text-xs text-muted-foreground">{platform.engagement}% engagement</div>
                    </div>
                  </div>
                  <Progress value={platform.engagement * 10} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getPlatformIcon(post.platform)}
                      <Badge variant="outline" className="text-xs">
                        #{index + 1} Top Post
                      </Badge>
                    </div>
                    <p className="text-sm">{post.content}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Share2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">{formatNumber(post.reach)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Growth Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Follower Growth</span>
                <div className="flex items-center space-x-1 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                <div className="flex items-center space-x-1 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+8.3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Post Frequency</span>
                <div className="flex items-center space-x-1 text-orange-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-5.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Click-through Rate</span>
                <div className="flex items-center space-x-1 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+15.7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Best Posting Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monday</span>
                <span className="text-sm text-muted-foreground">2:00 PM - 4:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tuesday</span>
                <span className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wednesday</span>
                <span className="text-sm text-muted-foreground">1:00 PM - 3:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Thursday</span>
                <span className="text-sm text-muted-foreground">11:00 AM - 1:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Friday</span>
                <span className="text-sm text-muted-foreground">3:00 PM - 5:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
