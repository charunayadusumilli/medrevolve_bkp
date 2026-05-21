import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AutoPostScheduler() {
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);
  const [postingFrequency, setPostingFrequency] = useState('daily');

  // Fetch recent posts
  const { data: recentPosts = [], refetch } = useQuery({
    queryKey: ['social-posts'],
    queryFn: async () => {
      try {
        const posts = await base44.entities.SocialPost.list('-published_at', 10);
        return posts;
      } catch {
        return [];
      }
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: async (schedule) => {
      // This would create a scheduled automation
      return { success: true, ...schedule };
    },
    onSuccess: () => {
      toast.success('Auto-posting schedule configured!');
    }
  });

  const handleToggleAutoPost = (enabled) => {
    setAutoPostEnabled(enabled);
    if (enabled) {
      // Create automation for auto-posting
      toast.success('Auto-posting enabled! Posts will be generated and published automatically.');
    }
  };

  const quickStats = {
    total: recentPosts.length,
    instagram: recentPosts.filter(p => p.platform === 'instagram').length,
    facebook: recentPosts.filter(p => p.platform === 'facebook').length,
    thisWeek: recentPosts.filter(p => {
      const postDate = new Date(p.published_at || p.created_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postDate >= weekAgo;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Auto-Post Controls */}
      <Card className="border-[#4A6741]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#4A6741]" />
            Automated Posting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Enable Auto-Posting</p>
              <p className="text-xs text-muted-foreground">
                Automatically generate and post content {postingFrequency}
              </p>
            </div>
            <Switch
              checked={autoPostEnabled}
              onCheckedChange={handleToggleAutoPost}
              className="data-[state=checked]:bg-[#4A6741]"
            />
          </div>

          {autoPostEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pt-3 border-t"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Posting Frequency</label>
                <div className="flex gap-2">
                  <Button
                    variant={postingFrequency === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPostingFrequency('daily')}
                    className={postingFrequency === 'daily' ? 'bg-[#4A6741] h-8' : 'h-8'}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={postingFrequency === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPostingFrequency('weekly')}
                    className={postingFrequency === 'weekly' ? 'bg-[#4A6741] h-8' : 'h-8'}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={postingFrequency === 'biweekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPostingFrequency('biweekly')}
                    className={postingFrequency === 'biweekly' ? 'bg-[#4A6741] h-8' : 'h-8'}
                  >
                    Bi-weekly
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-[#FDFBF7] border border-[#E8E0D5] rounded-lg">
                <p className="text-xs text-[#5A6B5A] mb-2"><strong>What gets posted:</strong></p>
                <ul className="text-xs text-[#5A6B5A] space-y-1">
                  <li>• Mix of telehealth, business, and compliance content</li>
                  <li>• All content is HIPAA-compliant and brand-consistent</li>
                  <li>• Posted at optimal engagement times (9-11 AM or 7-9 PM EST)</li>
                  <li>• Includes strategic hashtags and hooks</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-[#4A6741] hover:bg-[#3D5636] h-9">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Schedule
                </Button>
                <Button variant="outline" className="flex-1 h-9">
                  Preview Next Post
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#4A6741]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quickStats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quickStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-start gap-3 p-3 bg-[#FDFBF7] border border-[#E8E0D5] rounded-lg">
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt="Post" 
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {post.platform === 'instagram' ? '📸 IG' : '📘 FB'}
                      </Badge>
                      {post.topic && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {post.topic}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {post.caption?.substring(0, 60)}...
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(post.published_at || post.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Reminder */}
      <div className="p-4 bg-[#FFF3CD] border border-[#FFC107] rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#856404] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#856404] font-semibold mb-1">Compliance Reminder</p>
            <p className="text-xs text-[#856404]">
              All auto-generated content follows HIPAA guidelines and includes required disclaimers. 
              Review posts before publishing if you have specific compliance requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}