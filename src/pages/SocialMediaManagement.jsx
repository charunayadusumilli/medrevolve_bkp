import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, BarChart3, Calendar, Users, TrendingUp, Activity, Zap, AlertTriangle, CheckCircle2, ExternalLink, Phone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SocialMediaManagement() {
  const [isPosting, setIsPosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 100),
  });

  const igPosts = posts.filter(p => p.platform === 'instagram');
  const fbPosts = posts.filter(p => p.platform === 'facebook');
  const igPublished = igPosts.filter(p => p.status === 'published').length;
  const fbPublished = fbPosts.filter(p => p.status === 'published').length;
  const fbDrafts = fbPosts.filter(p => p.status === 'draft').length;

  const handleUGCPost = async () => {
    setIsPosting(true);
    try {
      const res = await base44.functions.invoke('autoPostUGCContent', {});
      if (res?.data?.instagram?.includes('✅')) {
        toast.success('✅ Posted to Instagram! ' + (res?.data?.facebook?.includes('✅') ? 'Facebook relayed via Zapier.' : 'Facebook: check Zapier setup.'));
      } else {
        toast.error('Post failed: ' + (res?.data?.errors?.[0] || 'Unknown error'));
      }
      refetchPosts();
    } catch (e) {
      toast.error('Error: ' + e.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleGenerateAndPost = async () => {
    setIsGenerating(true);
    try {
      const res = await base44.functions.invoke('generateAndPostAIContent', {});
      toast.success(`✅ Generated & posted! Instagram: ${res?.data?.instagram_posts || 0}, Facebook: ${res?.data?.facebook_posts || 0}`);
      refetchPosts();
    } catch (e) {
      toast.error('Error: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">Social Media</h1>
            <p className="text-[#0A0A0A]/60 text-sm flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> 240-387-5224</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> medrevolve.com</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUGCPost} disabled={isPosting}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white">
              <Zap className="w-4 h-4 mr-2" />
              {isPosting ? 'Posting...' : 'Post Now (UGC)'}
            </Button>
            <Button onClick={handleGenerateAndPost} disabled={isGenerating}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
              <Activity className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'AI Generate & Post'}
            </Button>
          </div>
        </div>

        {/* ── FACEBOOK WARNING BANNER ── */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-1">⚠️ Facebook Requires Zapier Setup</h3>
              <p className="text-amber-800 text-sm mb-3">
                Facebook has no direct API connector in this platform. Posts are relayed to your Facebook Page via Zapier.
                <strong> {fbDrafts} Facebook posts are stuck as drafts</strong> and have NEVER been published.
              </p>
              <div className="bg-white rounded-lg p-4 border border-amber-200 space-y-2 text-sm">
                <p className="font-bold text-amber-900">📋 To fix Facebook posting — do this once:</p>
                <ol className="space-y-1 text-amber-800 list-decimal list-inside">
                  <li>Go to <strong>zapier.com</strong> → Create a new Zap</li>
                  <li>Trigger: <strong>Webhooks by Zapier → Catch Hook</strong></li>
                  <li>Action: <strong>Facebook Pages → Create Page Post</strong> (connect your MedRevolve Facebook Page)</li>
                  <li>Map: <code className="bg-amber-100 px-1 rounded">message</code> → Post message, <code className="bg-amber-100 px-1 rounded">image_url</code> → Photo URL</li>
                  <li>Copy the Zapier webhook URL → paste it into Base44 Secrets as <code className="bg-amber-100 px-1 rounded">ZAPIER_WEBHOOK_URL</code></li>
                </ol>
                <a href="https://zapier.com/app/zaps" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-amber-700 font-bold hover:underline">
                  Open Zapier → <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Instagram Published', value: igPublished, icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
            { label: 'Facebook Published', value: fbPublished, icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Facebook Drafts (unpublished)', value: fbDrafts, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Total Posts', value: posts.length, icon: BarChart3, color: 'text-[#4A6741]', bg: 'bg-green-50' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-5 pb-4">
                  <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Status */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Instagram */}
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                Instagram
                <Badge className="bg-green-500 text-white ml-auto">✅ Connected & Posting</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✅ Connector authorized — auto-posts every 30 min</p>
              <p>✅ AI-generated images with direct-response captions</p>
              <p>✅ Phone number 240-387-5224 in every post</p>
              <p className="font-semibold text-green-700">{igPublished} posts live on Instagram</p>
            </CardContent>
          </Card>

          {/* Facebook */}
          <Card className="border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                Facebook
                <Badge className="bg-amber-500 text-white ml-auto">⚠️ Needs Zapier</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>⚠️ No direct Facebook API connector available</p>
              <p>⚠️ {fbDrafts} posts generated but never published</p>
              <p>→ Set up Zapier webhook → Facebook Pages (see banner above)</p>
              <p className="font-semibold text-blue-700">{fbPublished} posts relayed via Zapier so far</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Posts
              <Badge variant="outline" className="ml-auto">{posts.length} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {posts.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No posts yet. Click "Post Now" above.</p>}
              {posts.map((post) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-xl bg-white flex gap-4">
                  {post.image_url && (
                    <img src={post.image_url} alt="post" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.platform === 'instagram'
                        ? <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"><Instagram className="w-3 h-3 text-white" /></div>
                        : <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><Facebook className="w-3 h-3 text-white" /></div>
                      }
                      <span className="text-xs font-semibold capitalize">{post.platform}</span>
                      <Badge variant={post.status === 'published' ? 'default' : post.status === 'failed' ? 'destructive' : 'secondary'} className="text-[10px] ml-auto">
                        {post.status === 'published' ? '✅ Published' : post.status === 'failed' ? '❌ Failed' : '⏳ Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-1">{post.caption}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.created_date).toLocaleString()}</p>
                    {post.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{post.notes}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}