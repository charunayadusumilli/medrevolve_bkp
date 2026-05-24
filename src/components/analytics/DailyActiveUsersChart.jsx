import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

export default function DailyActiveUsersChart({ dailyUsers }) {
  if (!dailyUsers || dailyUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-[#4A6741]" />
            Daily Active Users — Wellness Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 text-center py-8">No user activity data yet</p>
        </CardContent>
      </Card>
    );
  }

  const peak = Math.max(...dailyUsers.map(d => d.users));
  const avg = Math.round(dailyUsers.reduce((s, d) => s + d.users, 0) / dailyUsers.length);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-[#4A6741]" />
            Daily Active Users — Wellness Journey
          </CardTitle>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Peak: <strong className="text-gray-800">{peak}</strong></span>
            <span>Avg: <strong className="text-gray-800">{avg}/day</strong></span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyUsers} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4A6741" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4A6741" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(val) => [val, 'Active Users']}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#4A6741"
              strokeWidth={2}
              fill="url(#dauGradient)"
              dot={{ r: 3, fill: '#4A6741' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Unique visitors per day from Google Analytics (G-BZTEFSTDPL)
        </p>
      </CardContent>
    </Card>
  );
}