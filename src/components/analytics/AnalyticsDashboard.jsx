import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Users, Eye, MousePointerClick, 
  BarChart3, Calendar, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState(30);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await base44.functions.invoke('getAnalytics', { days: timeRange });
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Visitors',
      value: analytics?.summary?.totalVisitors || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Page Views',
      value: analytics?.summary?.totalPageViews || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Avg. Pages/Visitor',
      value: analytics?.summary?.averagePageViewsPerVisitor || 0,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Top Actions',
      value: analytics?.topActions?.length || 0,
      icon: MousePointerClick,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2D3A2D]">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-[#4A6741] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Popular Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.pageViews?.slice(0, 8).map(([page, views], idx) => (
                <div key={page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <span className="font-medium">{page}</span>
                  </div>
                  <Badge variant="secondary">{views} views</Badge>
                </div>
              ))}
              {analytics?.pageViews?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No page views recorded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.sources?.map(([source, count]) => {
                const percentage = ((count / (analytics?.summary?.totalPageViews || 1)) * 100).toFixed(1);
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{source}</span>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4A6741] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {analytics?.sources?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No traffic sources recorded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5" />
              Top Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.topActions?.map(([action, count], idx) => (
                <div key={action} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <span className="font-medium">{action}</span>
                  </div>
                  <Badge variant="secondary">{count} clicks</Badge>
                </div>
              ))}
              {analytics?.topActions?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No actions tracked yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics?.dailyTrends?.slice(-7).map(([date, views]) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4A6741]"
                        style={{ width: `${(views / Math.max(...analytics.dailyTrends.map(d => d[1]))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{views}</span>
                  </div>
                </div>
              ))}
              {analytics?.dailyTrends?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No daily data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}