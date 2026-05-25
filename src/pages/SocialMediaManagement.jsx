import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Facebook, BarChart3, Calendar, Users, TrendingUp, Activity, Plus, Edit2, Trash2, Save, X, Zap, Image, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SocialMediaManagement() {
  const [editingAccount, setEditingAccount] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate and post content immediately
  const generateAndPostMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('generateSocialMediaContent', {});
      return response;
    },
    onSuccess: async (data) => {
      toast.success(`Generated ${data.posts?.length || 0} marketing assets!`);
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      // Optionally auto-post after generation
      await handleQuickPost();
    },
    onError: (error) => {
      toast.error('Failed to generate content: ' + error.message);
    },
  });

  // Quick post to all platforms
  const handleQuickPost = async () => {
    try {
      setIsGenerating(true);
      // Post UGC content
      await base44.functions.invoke('autoPostUGCContent', {});
      toast.success('✅ Posted to Instagram & Facebook!');
      refetchPosts();
    } catch (error) {
      toast.error('Posting failed: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async () => {
    generateAndPostMutation.mutate();
  };

  // Fetch social accounts
  const { data: accounts = [], refetch: refetchAccounts } = useQuery({
    queryKey: ['socialAccounts'],
    queryFn: () => base44.entities.SocialAccount.list(),
  });

  // Fetch recent posts
  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 50),
  });

  const queryClient = useQueryClient();

  const updateAccountMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await base44.entities.SocialAccount.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
      setEditingAccount(null);
      toast.success('Account updated successfully!');
    },
  });

  const handleEdit = (account) => {
    setEditingAccount(account.id);
    setEditForm({
      handle: account.handle,
      username: account.username,
      follower_count: account.follower_count,
    });
  };

  const handleSave = (accountId) => {
    updateAccountMutation.mutate({
      id: accountId,
      data: editForm,
    });
  };

  const handleCancel = () => {
    setEditingAccount(null);
    setEditForm({});
  };

  // Calculate stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const scheduledPosts = posts.filter(p => p.status === 'draft').length;
  const totalFollowers = accounts.reduce((sum, acc) => sum + (acc.follower_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Social Media Management</h1>
              <p className="text-[#0A0A0A]/60">Manage all social media accounts, track performance, and monitor automated posting</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate & Post Now'}
              </Button>
              <Button
                onClick={handleQuickPost}
                disabled={isGenerating}
                variant="outline"
                className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741] hover:text-white"
              >
                <Image className="w-4 h-4 mr-2" />
                Quick Post
              </Button>
            </div>
          </div>
          
          {/* Marketing Focus Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">📢 Active Marketing Campaign</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Generating UGC content, static ads, reels, and video ads for <strong>medrevolve.com</strong> promotion
                </p>
                <div className="flex gap-4 mt-2 text-xs text-blue-700">
                  <span>📞 <strong>240-387-5224</strong></span>
                  <span>🌐 <strong>medrevolve.com</strong></span>
                  <span>🎯 <strong>GLP-1, Telehealth, RUO</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Calendar className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Instagram className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts}</div>
              <p className="text-xs text-muted-foreground">Live posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <BarChart3 className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledPosts}</div>
              <p className="text-xs text-muted-foreground">In queue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="w-4 h-4 text-[#4A6741]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Combined followers</p>
            </CardContent>
          </Card>
        </div>

        {/* Connected Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg bg-white"
                  >
                    {editingAccount === account.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium">Handle</label>
                          <Input
                            value={editForm.handle}
                            onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Username</label>
                          <Input
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            placeholder="username"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Followers</label>
                          <Input
                            type="number"
                            value={editForm.follower_count}
                            onChange={(e) => setEditForm({ ...editForm, follower_count: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(account.id)}
                            className="bg-[#4A6741] hover:bg-[#3D5636]"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">{account.handle || '@medrevolve'}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.follower_count?.toLocaleString() || 0} followers
                            </p>
                            <Badge className="mt-1 bg-[#28A745] text-white">Active</Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(account)}>
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No accounts connected yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Automation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Automation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#D4EDDA] border border-[#28A745] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#155724]">Auto-Posting Active</span>
                  <Badge className="bg-[#28A745] text-white">Running</Badge>
                </div>
                <p className="text-sm text-[#155724]">Posts every 30 minutes to Instagram + Facebook</p>
                <p className="text-xs text-[#155724] mt-1">B2B focused content for MedRevolve</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <span className="text-sm font-medium">Next Post</span>
                  <span className="text-sm text-muted-foreground">In ~30 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <span className="text-sm font-medium">Content Type</span>
                  <span className="text-sm text-[#4A6741]">B2B Promotional</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <span className="text-sm font-medium">Platforms</span>
                  <div className="flex gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636]">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button 
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Create New Content'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {post.platform === 'instagram' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Instagram className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {post.platform === 'facebook' && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Facebook className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold capitalize">{post.platform}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.created_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          post.status === 'published'
                            ? 'default'
                            : post.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-3 mb-2">{post.caption}</p>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.hashtags.slice(0, 5).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {post.notes && post.status === 'failed' && (
                      <p className="text-xs text-red-600 mt-2">{post.notes}</p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span>❤️ {post.engagement_likes || 0}</span>
                      <span>💬 {post.engagement_comments || 0}</span>
                      <span>🔄 {post.engagement_shares || 0}</span>
                      <span>👁️ {post.reach || 0}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No posts yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}