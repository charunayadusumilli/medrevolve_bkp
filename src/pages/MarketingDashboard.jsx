import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, Mail, Users, TrendingUp, Calendar, MessageSquare, 
  Play, RefreshCw, CheckCircle, Clock, AlertCircle, BarChart3,
  Instagram, Facebook, Linkedin, Send, Video
} from 'lucide-react';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/auth/RequireAuth';

export default function MarketingDashboard() {
  const queryClient = useQueryClient();
  const [generatingContent, setGeneratingContent] = useState(false);

  // Fetch leads
  const { data: leads = [] } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 50),
  });

  // Fetch social posts
  const { data: posts = [] } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 50),
  });

  // Fetch business inquiries
  const { data: inquiries = [] } = useQuery({
    queryKey: ['businessInquiries'],
    queryFn: () => base44.entities.BusinessInquiry.list('-created_date', 50),
  });

  // Fetch TikTok analytics
  const { data: tiktokData } = useQuery({
    queryKey: ['tiktokAnalytics'],
    queryFn: () => base44.entities.TikTokAnalytics.list('-sync_date', 1).then(res => res[0]),
  });

  // Sync TikTok mutation
  const syncTikTokMutation = useMutation({
    mutationFn: () => base44.functions.invoke('syncTikTokAnalytics', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiktokAnalytics'] });
    },
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: () => base44.functions.invoke('generateSocialMediaContent', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
      setGeneratingContent(false);
    },
  });

  const handleGenerateContent = () => {
    setGeneratingContent(true);
    generateContentMutation.mutate();
  };

  // Calculate stats
  const stats = {
    totalLeads: leads.length + inquiries.length,
    newThisWeek: leads.filter(l => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(l.created_date) > weekAgo;
    }).length,
    scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
  };

  const recentLeads = [...leads, ...inquiries]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 10);

  return (
    <RequireAuth requireAdmin>
      <div className="min-h-screen bg-[#FDFBF7] p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2">Marketing Dashboard</h1>
            <p className="text-[#6B8F5E]">Track leads, manage social media, and monitor campaign performance</p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border-[#4A6741]/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6B8F5E]">Total Leads</CardTitle>
                  <Users className="w-4 h-4 text-[#4A6741]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0A0A]">{stats.totalLeads}</div>
                  <p className="text-xs text-[#6B8F5E] mt-1">{stats.newThisWeek} this week</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white border-[#4A6741]/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6B8F5E]">Published Posts</CardTitle>
                  <Instagram className="w-4 h-4 text-[#4A6741]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0A0A]">{stats.publishedPosts}</div>
                  <p className="text-xs text-[#6B8F5E] mt-1">{stats.scheduledPosts} scheduled</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white border-[#4A6741]/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6B8F5E]">Phone Calls</CardTitle>
                  <Phone className="w-4 h-4 text-[#4A6741]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0A0A]">240-387-5224</div>
                  <p className="text-xs text-[#6B8F5E] mt-1">Active 24/7</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white border-[#4A6741]/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#6B8F5E]">TikTok Followers</CardTitle>
                  <Video className="w-4 h-4 text-[#4A6741]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0A0A]">
                    {tiktokData?.follower_count || 0}
                  </div>
                  <p className="text-xs text-[#6B8F5E] mt-1">
                    {tiktokData?.video_count || 0} videos
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList className="bg-white border border-[#4A6741]/20">
              <TabsTrigger value="leads" className="data-[state=active]:bg-[#4A6741] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-[#4A6741] data-[state=active]:text-white">
                <Instagram className="w-4 h-4 mr-2" />
                Social Media
              </TabsTrigger>
              <TabsTrigger value="tiktok" className="data-[state=active]:bg-[#4A6741] data-[state=active]:text-white">
                <Video className="w-4 h-4 mr-2" />
                TikTok
              </TabsTrigger>
              <TabsTrigger value="automation" className="data-[state=active]:bg-[#4A6741] data-[state=active]:text-white">
                <Play className="w-4 h-4 mr-2" />
                Automation
              </TabsTrigger>
            </TabsList>

            {/* Leads Tab */}
            <TabsContent value="leads" className="space-y-4">
              <Card className="bg-white border-[#4A6741]/20">
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest inquiries from all sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLeads.length === 0 ? (
                      <p className="text-center text-[#6B8F5E] py-8">No leads yet. Start marketing to generate interest!</p>
                    ) : (
                      recentLeads.map((lead, idx) => (
                        <motion.div
                          key={lead.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-lg border border-[#4A6741]/10"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#0A0A0A]">
                                {lead.name || lead.contact_name || 'Anonymous'}
                              </h4>
                              <Badge variant="outline" className="text-[#4A6741] border-[#4A6741]">
                                {lead.source || 'website'}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#6B8F5E]">
                              {lead.email || 'No email provided'}
                            </p>
                            {lead.phone && (
                              <p className="text-sm text-[#6B8F5E]">
                                {lead.phone}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#6B8F5E]">
                              {new Date(lead.created_date).toLocaleDateString()}
                            </p>
                            <a 
                              href={`tel:+12403875224`}
                              className="inline-flex items-center gap-1 text-[#4A6741] hover:text-[#6B8F5E] text-sm font-medium mt-1"
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#0A0A0A]">Social Posts</h3>
                <Button 
                  onClick={handleGenerateContent}
                  disabled={generatingContent}
                  className="bg-[#4A6741] hover:bg-[#6B8F5E] text-white"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${generatingContent ? 'animate-spin' : ''}`} />
                  {generatingContent ? 'Generating...' : 'Generate New Content'}
                </Button>
              </div>

              <div className="grid gap-4">
                {posts.length === 0 ? (
                  <Card className="bg-white border-[#4A6741]/20">
                    <CardContent className="py-8 text-center">
                      <p className="text-[#6B8F5E]">No posts yet. Click "Generate New Content" to create posts!</p>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="bg-white border-[#4A6741]/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {post.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                              {post.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                              {post.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-700" />}
                              <CardTitle className="text-base capitalize">{post.platform}</CardTitle>
                            </div>
                            <Badge 
                              className={
                                post.status === 'published' ? 'bg-green-500' :
                                post.status === 'scheduled' ? 'bg-blue-500' :
                                'bg-red-500'
                              }
                            >
                              {post.status === 'published' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {post.status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                              {post.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {post.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-[#6B8F5E] line-clamp-3 mb-2">
                            {post.caption}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#6B8F5E]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : 'Not scheduled'}
                            </span>
                            {post.published_at && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Published: {new Date(post.published_at).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* TikTok Tab */}
            <TabsContent value="tiktok" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#0A0A0A]">TikTok Analytics</h3>
                <Button 
                  onClick={() => syncTikTokMutation.mutate()}
                  disabled={syncTikTokMutation.isPending}
                  className="bg-[#4A6741] hover:bg-[#6B8F5E] text-white"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncTikTokMutation.isPending ? 'animate-spin' : ''}`} />
                  {syncTikTokMutation.isPending ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>

              {tiktokData ? (
                <div className="grid gap-4">
                  <Card className="bg-white border-[#4A6741]/20">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        {tiktokData.avatar_url && (
                          <img 
                            src={tiktokData.avatar_url} 
                            alt={tiktokData.username}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <CardTitle className="text-xl">@{tiktokData.username}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            {tiktokData.nickname}
                            {tiktokData.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tiktokData.bio && (
                        <p className="text-sm text-[#6B8F5E] mb-4">{tiktokData.bio}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-[#FDFBF7] rounded-lg">
                          <div className="text-2xl font-bold text-[#0A0A0A]">
                            {tiktokData.follower_count.toLocaleString()}
                          </div>
                          <p className="text-xs text-[#6B8F5E] mt-1">Followers</p>
                        </div>
                        <div className="text-center p-4 bg-[#FDFBF7] rounded-lg">
                          <div className="text-2xl font-bold text-[#0A0A0A]">
                            {tiktokData.following_count.toLocaleString()}
                          </div>
                          <p className="text-xs text-[#6B8F5E] mt-1">Following</p>
                        </div>
                        <div className="text-center p-4 bg-[#FDFBF7] rounded-lg">
                          <div className="text-2xl font-bold text-[#0A0A0A]">
                            {tiktokData.heart_count.toLocaleString()}
                          </div>
                          <p className="text-xs text-[#6B8F5E] mt-1">Likes</p>
                        </div>
                        <div className="text-center p-4 bg-[#FDFBF7] rounded-lg">
                          <div className="text-2xl font-bold text-[#0A0A0A]">
                            {tiktokData.video_count.toLocaleString()}
                          </div>
                          <p className="text-xs text-[#6B8F5E] mt-1">Videos</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B8F5E] mt-4 text-center">
                        Last synced: {new Date(tiktokData.sync_date).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-white border-[#4A6741]/20">
                  <CardContent className="py-8 text-center">
                    <p className="text-[#6B8F5E]">No TikTok data yet. Click "Sync Now" to fetch analytics!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-4">
              <Card className="bg-white border-[#4A6741]/20">
                <CardHeader>
                  <CardTitle>Active Automations</CardTitle>
                  <CardDescription>Scheduled tasks running in the background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-lg border border-[#4A6741]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-[#4A6741]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0A0A0A]">Daily Content Generation</h4>
                          <p className="text-sm text-[#6B8F5E]">Generates social media posts every day at 8:00 AM</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-lg border border-[#4A6741]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
                          <Send className="w-5 h-5 text-[#4A6741]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0A0A0A]">Auto-Post to Social Media</h4>
                          <p className="text-sm text-[#6B8F5E]">Posts to Instagram, Facebook 3x daily (9am, 1pm, 7pm)</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-lg border border-[#4A6741]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-[#4A6741]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0A0A0A]">IONOS AI Phone System</h4>
                          <p className="text-sm text-[#6B8F5E]">24/7 call answering, lead qualification, appointment booking</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#4A6741]/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manual triggers for marketing tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/10"
                      onClick={() => window.open('https://medrevolve.com/ForBusiness', '_blank')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View B2B Landing Page
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/10"
                      onClick={() => window.open('https://medrevolve.com/WaterHome', '_blank')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View RUO Products Page
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/10"
                      onClick={() => window.open('tel:+12403875224')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Test Phone System
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/10"
                      onClick={() => alert('Check your email for the latest lead report!')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Weekly Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuth>
  );
}