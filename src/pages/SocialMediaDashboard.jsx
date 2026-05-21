import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Facebook, BarChart3, Calendar, Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [postContent, setPostContent] = useState({ caption: '', imageUrl: '' });
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  // Check if connectors are authorized
  const { data: connectors, isLoading } = useQuery({
    queryKey: ['connectors'],
    queryFn: async () => {
      try {
        // This will fail if not authorized, which is expected
        return { instagram: false, facebook: false };
      } catch {
        return { instagram: false, facebook: false };
      }
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await base44.functions.invoke('createSocialPost', postData);
      return response.data;
    },
    onSuccess: () => {
      setPostContent({ caption: '', imageUrl: '' });
      alert('Post created successfully!');
    },
    onError: (error) => {
      alert('Error creating post: ' + error.message);
    }
  });

  const handleCreatePost = () => {
    createPostMutation.mutate({
      platform: selectedPlatform,
      caption: postContent.caption,
      image_url: postContent.imageUrl
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Social Media Marketing</h1>
          <p className="text-[#0A0A0A]/60">Manage Instagram & Facebook posts, analytics, and automation</p>
        </div>

        {/* Setup Alert */}
        {!connectors?.instagram && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-[#FFF3CD] border-[#FFC107]">
              <CardContent className="flex items-start gap-4 p-4">
                <AlertCircle className="w-5 h-5 text-[#FFC107] mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#856404] mb-1">Connect Your Social Media Accounts</h3>
                  <p className="text-sm text-[#856404] mb-3">
                    To post and manage content, you need to connect your Instagram Business and Facebook Page.
                  </p>
                  <div className="space-y-2 text-sm text-[#856404]">
                    <p><strong>Requirements:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Convert Instagram to Business Account (free in Instagram settings)</li>
                      <li>Connect Instagram to a Facebook Page</li>
                      <li>Have admin access to the Facebook Page</li>
                    </ul>
                  </div>
                  <Button className="mt-3 bg-[#4A6741] hover:bg-[#3D5636]">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Connect Instagram & Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Instagram className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <BarChart3 className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--%</div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Upcoming posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reach</CardTitle>
              <Facebook className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-[#0A0A0A]/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">No posts yet. Start by creating your first post!</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636]" onClick={() => setActiveTab('create')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('schedule')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Content
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Platform</label>
                  <div className="flex gap-3">
                    <Button
                      variant={selectedPlatform === 'instagram' ? 'default' : 'outline'}
                      onClick={() => setSelectedPlatform('instagram')}
                      className={selectedPlatform === 'instagram' ? 'bg-[#4A6741]' : ''}
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                    <Button
                      variant={selectedPlatform === 'facebook' ? 'default' : 'outline'}
                      onClick={() => setSelectedPlatform('facebook')}
                      className={selectedPlatform === 'facebook' ? 'bg-[#1877F2]' : ''}
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={postContent.imageUrl}
                    onChange={(e) => setPostContent({ ...postContent, imageUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption</label>
                  <Textarea
                    placeholder="Write your caption here..."
                    rows={5}
                    value={postContent.caption}
                    onChange={(e) => setPostContent({ ...postContent, caption: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {postContent.caption.length} characters
                  </p>
                </div>

                <Button
                  onClick={handleCreatePost}
                  disabled={!postContent.caption || !postContent.imageUrl}
                  className="w-full bg-[#4A6741] hover:bg-[#3D5636]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Publish Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">No scheduled posts yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Connect your accounts to view analytics.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Instagram Business</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Facebook Page</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}