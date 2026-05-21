import React, { useState, useEffect } from 'react';
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
  const [isConnected, setIsConnected] = useState(false);
  const [instagramUser, setInstagramUser] = useState(null);

  // Check if Instagram connector is authorized
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await base44.functions.invoke('checkInstagramConnection', {});
        if (response.data.connected) {
          setIsConnected(true);
          setInstagramUser(response.data.user);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

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

        {/* Connected Alert */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-[#D4EDDA] border-[#28A745]">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#28A745] rounded-full flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#155724]">Instagram Connected</h3>
                    <p className="text-sm text-[#155724]">
                      {instagramUser?.username ? `@${instagramUser.username}` : 'Business Account'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-[#28A745] text-white">Active</Badge>
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

            {!isConnected && (
              <Card className="bg-[#FFF3CD] border-[#FFC107]">
                <CardContent className="p-4">
                  <p className="text-sm text-[#856404] mb-3">
                    You need to connect your Instagram Business account first.
                  </p>
                  <Button 
                    onClick={async () => {
                      // Trigger OAuth flow
                      window.location.href = '/dashboard/integrations';
                    }}
                    className="bg-[#4A6741] hover:bg-[#3D5636]"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Connect Instagram Now
                  </Button>
                </CardContent>
              </Card>
            )}
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
                <CardTitle>Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Instagram Business</p>
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? instagramUser?.username : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {isConnected ? (
                    <Badge className="bg-[#28A745] text-white">Connected</Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/dashboard/integrations'}
                    >
                      Connect
                    </Button>
                  )}
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Facebook posting is available through your Instagram Business connection.
                    Make sure your Instagram is linked to a Facebook Page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}