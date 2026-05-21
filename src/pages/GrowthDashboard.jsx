import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, TrendingUp, Eye, Instagram, Globe, Heart,
  MessageSquare, RefreshCw, Play, BarChart3, 
  UserCheck, Building2, Zap, ExternalLink, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/auth/RequireAuth';

function StatCard({ label, value, icon: Icon, color, sub, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
              <p className="text-3xl font-bold mt-1 text-gray-900">{value ?? '—'}</p>
              {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GrowthDashboardInner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [postResult, setPostResult] = useState(null);
  const [siteAnalytics, setSiteAnalytics] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [socialRes, analyticsRes] = await Promise.all([
        base44.functions.invoke('getSocialAnalytics', {}),
        base44.functions.invoke('getAnalytics', { days: 30 }),
      ]);
      setData(socialRes.data);
      setSiteAnalytics(analyticsRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAutoPost = async () => {
    setPosting(true);
    setPostResult(null);
    try {
      const res = await base44.functions.invoke('autoSEOPost', {});
      setPostResult(res.data);
    } catch (e) {
      setPostResult({ error: e.message });
    }
    setPosting(false);
    setTimeout(loadData, 3000);
  };

  const ig = data?.instagram;
  const platform = data?.platform;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-[#4A6741]" />
              Growth & Analytics Hub
            </h1>
            <p className="text-gray-500 mt-1">Instagram + Platform + SEO automation — all in one place</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleAutoPost}
              disabled={posting}
              className="bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white border-0 gap-2"
            >
              {posting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {posting ? 'Posting...' : 'Auto SEO Post to Instagram'}
            </Button>
            <Button variant="outline" onClick={loadData} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Post result */}
        {postResult && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`border ${postResult.error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="pt-4 pb-4">
                {postResult.error ? (
                  <p className="text-red-700 text-sm">❌ {postResult.error}</p>
                ) : (
                  <div>
                    <p className="text-green-700 font-semibold">✅ SEO post published to Instagram!</p>
                    <p className="text-green-600 text-sm mt-1">Topic: {postResult.topic} • Post ID: {postResult.post_id}</p>
                    <p className="text-gray-600 text-xs mt-1 italic">"{postResult.caption_preview}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4A6741]" />
              <p className="text-gray-500 text-sm">Loading analytics from all sources...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="bg-white border border-gray-200 rounded-xl p-1">
              <TabsTrigger value="overview" className="rounded-lg text-xs">📊 Overview</TabsTrigger>
              <TabsTrigger value="instagram" className="rounded-lg text-xs">📸 Instagram</TabsTrigger>
              <TabsTrigger value="platform" className="rounded-lg text-xs">🏥 Platform</TabsTrigger>
              <TabsTrigger value="traffic" className="rounded-lg text-xs">🌐 Traffic & SEO</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="IG Followers" value={ig?.followers?.toLocaleString()} icon={Instagram} color="bg-gradient-to-br from-[#E1306C] to-[#833AB4]" delay={0.0} />
                <StatCard label="IG Reach (30d)" value={ig?.reach_30d?.toLocaleString()} icon={Eye} color="bg-purple-500" sub="Instagram reach" delay={0.05} />
                <StatCard label="New Customers (30d)" value={platform?.new_customers_30d} icon={Users} color="bg-blue-500" delay={0.1} />
                <StatCard label="New Contacts (30d)" value={platform?.new_contacts_30d} icon={MessageSquare} color="bg-orange-500" delay={0.15} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Site Visitors (30d)" value={siteAnalytics?.summary?.totalVisitors} icon={Globe} color="bg-green-500" delay={0.2} />
                <StatCard label="Page Views (30d)" value={siteAnalytics?.summary?.totalPageViews} icon={Eye} color="bg-teal-500" delay={0.25} />
                <StatCard label="Active Partners" value={platform?.total_partners} icon={Building2} color="bg-indigo-500" delay={0.3} />
                <StatCard label="New Appointments (30d)" value={platform?.new_appointments_30d} icon={Calendar} color="bg-rose-500" delay={0.35} />
              </div>

              {/* Traffic sources side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><Globe className="w-4 h-4" />Website Traffic Sources</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {siteAnalytics?.sources?.length > 0 ? siteAnalytics.sources.map(([source, count]) => {
                      const pct = ((count / (siteAnalytics.summary.totalPageViews || 1)) * 100).toFixed(1);
                      return (
                        <div key={source}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{source}</span>
                            <span className="text-gray-500">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-full bg-[#4A6741] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    }) : <p className="text-sm text-gray-400 text-center py-4">No traffic data yet</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" />Lead Sources</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {platform?.source_breakdown && Object.entries(platform.source_breakdown).length > 0
                      ? Object.entries(platform.source_breakdown).sort((a, b) => b[1] - a[1]).map(([src, cnt]) => (
                        <div key={src} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{src.replace(/_/g, ' ')}</span>
                          <Badge variant="secondary">{cnt} leads</Badge>
                        </div>
                      ))
                      : <p className="text-sm text-gray-400 text-center py-4">No lead source data yet</p>}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* INSTAGRAM TAB */}
            <TabsContent value="instagram" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Followers" value={ig?.followers?.toLocaleString()} icon={UserCheck} color="bg-gradient-to-br from-[#E1306C] to-[#833AB4]" />
                <StatCard label="Total Posts" value={ig?.media_count} icon={Instagram} color="bg-pink-500" />
                <StatCard label="Reach (30d)" value={ig?.reach_30d?.toLocaleString()} icon={Eye} color="bg-purple-500" />
                <StatCard label="Impressions (30d)" value={ig?.impressions_30d?.toLocaleString()} icon={TrendingUp} color="bg-indigo-500" />
                <StatCard label="Profile Views (30d)" value={ig?.profile_views_30d?.toLocaleString()} icon={Users} color="bg-blue-500" />
                <StatCard label="Engaged Accounts" value={ig?.accounts_engaged_30d?.toLocaleString()} icon={Heart} color="bg-rose-500" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Recent Posts Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {ig?.recent_posts?.length > 0 ? ig.recent_posts.map(post => (
                      <div key={post.id} className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        {post.media_url && (
                          <img src={post.media_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 line-clamp-2">{post.caption || '(no caption)'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Heart className="w-3 h-3 text-rose-400" />{post.likes}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-blue-400" />{post.comments}
                            </span>
                            <Badge variant="outline" className="text-xs">{post.type}</Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                        <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                          <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-700" />
                        </a>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 col-span-2 text-center py-6">No Instagram posts found. Try posting with the Auto SEO Post button!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-purple-900">🚀 Auto SEO Instagram Posting</h3>
                      <p className="text-sm text-purple-700 mt-1">AI generates telehealth content + posts automatically with SEO keywords. Use the automation scheduler to run this weekly.</p>
                    </div>
                    <Button
                      onClick={handleAutoPost}
                      disabled={posting}
                      className="bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white border-0 shrink-0"
                    >
                      {posting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PLATFORM TAB */}
            <TabsContent value="platform" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Customers" value={platform?.total_customers} icon={Users} color="bg-blue-500" />
                <StatCard label="Total Contacts/Leads" value={platform?.total_contacts} icon={MessageSquare} color="bg-orange-500" />
                <StatCard label="Active Partners" value={platform?.total_partners} icon={Building2} color="bg-green-500" />
                <StatCard label="Active Providers" value={platform?.total_providers} icon={UserCheck} color="bg-purple-500" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold">30-Day Growth</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'New Customers', value: platform?.new_customers_30d, color: 'bg-blue-500' },
                      { label: 'New Leads/Contacts', value: platform?.new_contacts_30d, color: 'bg-orange-500' },
                      { label: 'New Appointments', value: platform?.new_appointments_30d, color: 'bg-green-500' },
                      { label: 'Published Posts', value: platform?.published_posts_30d, color: 'bg-pink-500' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <Badge>{item.value ?? 0}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold">Lead Sources Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {platform?.source_breakdown && Object.entries(platform.source_breakdown).length > 0
                      ? Object.entries(platform.source_breakdown).sort((a, b) => b[1] - a[1]).map(([src, cnt]) => {
                        const total = Object.values(platform.source_breakdown).reduce((a, b) => a + b, 0);
                        const pct = ((cnt / total) * 100).toFixed(0);
                        return (
                          <div key={src}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{src.replace(/_/g, ' ')}</span>
                              <span className="text-gray-500">{cnt} ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-full bg-[#4A6741] rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                      : <p className="text-sm text-gray-400 text-center py-4">No source data yet</p>}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TRAFFIC & SEO TAB */}
            <TabsContent value="traffic" className="space-y-4 mt-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold text-green-900 mb-2">🔍 SEO Status</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {[
                      { label: 'Title Tag', status: '✅', detail: 'MedRevolve – Launch Your Telehealth Business Today' },
                      { label: 'Meta Description', status: '✅', detail: 'Full 160-char description set' },
                      { label: 'Open Graph Tags', status: '✅', detail: 'Facebook & Twitter cards configured' },
                      { label: 'JSON-LD Schema', status: '✅', detail: 'MedicalOrganization + WebSite schema active' },
                      { label: 'Facebook Pixel', status: '⚠️', detail: 'Pixel ID needs to be set in index.html' },
                      { label: 'Google Analytics', status: '✅', detail: 'G-BZTEFSTDPL tracking active' },
                      { label: 'Canonical URL', status: '✅', detail: 'https://medrevolve.com/' },
                      { label: 'Sitemap', status: '⚠️', detail: 'Submit sitemap to Google Search Console' },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-green-100">
                        <span className="text-base">{item.status}</span>
                        <div>
                          <p className="font-medium text-green-900">{item.label}</p>
                          <p className="text-green-700 text-xs">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><Eye className="w-4 h-4" />Top Pages (30d)</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {siteAnalytics?.pageViews?.slice(0, 8).map(([page, views], idx) => (
                      <div key={page} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">#{idx + 1}</span>
                          <span className="text-sm font-medium">{page}</span>
                        </div>
                        <Badge variant="secondary">{views} views</Badge>
                      </div>
                    ))}
                    {!siteAnalytics?.pageViews?.length && <p className="text-sm text-gray-400 text-center py-4">No page data yet</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4" />Top Conversion Actions</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {siteAnalytics?.topActions?.slice(0, 8).map(([action, count], idx) => (
                      <div key={action} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">#{idx + 1}</span>
                          <span className="text-sm font-medium">{action}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                    {!siteAnalytics?.topActions?.length && <p className="text-sm text-gray-400 text-center py-4">No action data yet</p>}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-sm font-semibold">Daily Traffic Trends (Last 7 Days)</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {siteAnalytics?.dailyTrends?.slice(-7).length > 0 ? siteAnalytics.dailyTrends.slice(-7).map(([date, views]) => {
                    const max = Math.max(...siteAnalytics.dailyTrends.slice(-7).map(d => d[1]));
                    return (
                      <div key={date} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-[#4A6741] rounded-full transition-all" style={{ width: `${(views / max) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8 text-right">{views}</span>
                      </div>
                    );
                  }) : <p className="text-sm text-gray-400 text-center py-4">No trend data yet</p>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default function GrowthDashboard() {
  return (
    <RequireAuth portalName="Growth Dashboard" requiredRole="admin">
      <GrowthDashboardInner />
    </RequireAuth>
  );
}