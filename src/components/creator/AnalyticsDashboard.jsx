import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, MousePointer, 
  Calendar, Download, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Sample data for demonstration
const monthlyData = [
  { month: 'Jan', clicks: 1200, conversions: 45, revenue: 6750, commission: 1012 },
  { month: 'Feb', clicks: 1450, conversions: 58, revenue: 8700, commission: 1305 },
  { month: 'Mar', clicks: 1680, conversions: 72, revenue: 10800, commission: 1620 },
  { month: 'Apr', clicks: 2100, conversions: 95, revenue: 14250, commission: 2137 },
  { month: 'May', clicks: 2450, conversions: 118, revenue: 17700, commission: 2655 },
  { month: 'Jun', clicks: 2890, conversions: 142, revenue: 21300, commission: 3195 }
];

const productData = [
  { name: 'Semaglutide', sales: 45, revenue: 13455 },
  { name: 'Tirzepatide', sales: 32, revenue: 12768 },
  { name: 'Testosterone', sales: 28, revenue: 5572 },
  { name: 'Sermorelin', sales: 22, revenue: 4378 },
  { name: 'NAD+', sales: 15, revenue: 2685 }
];

const trafficSources = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'TikTok', value: 30, color: '#000000' },
  { name: 'YouTube', value: 15, color: '#FF0000' },
  { name: 'Blog', value: 10, color: '#4A6741' }
];

const StatCard = ({ icon: Icon, title, value, change, prefix = '', suffix = '' }) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#4A6741]/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#4A6741]" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        <h3 className="text-sm text-[#5A6B5A] mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[#2D3A2D]">
          {prefix}{value.toLocaleString()}{suffix}
        </p>
      </CardContent>
    </Card>
  );
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <section className="py-20 px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-2">
              Performance <span className="font-medium text-[#4A6741]">Analytics</span>
            </h2>
            <p className="text-[#5A6B5A]">
              Track your success with real-time data and insights
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <StatCard 
            icon={DollarSign}
            title="Total Commission"
            value={12024}
            change={18.2}
            prefix="$"
          />
          <StatCard 
            icon={TrendingUp}
            title="Total Revenue"
            value={80000}
            change={22.5}
            prefix="$"
          />
          <StatCard 
            icon={Users}
            title="Conversions"
            value={530}
            change={15.8}
          />
          <StatCard 
            icon={MousePointer}
            title="Total Clicks"
            value={13770}
            change={12.3}
          />
        </motion.div>

        {/* Charts Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-[#E8E0D5] p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#2D3A2D]">
                  Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
                    <XAxis dataKey="month" stroke="#5A6B5A" />
                    <YAxis stroke="#5A6B5A" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E8E0D5',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#8B7355" 
                      strokeWidth={2}
                      dot={{ fill: '#8B7355' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#4A6741" 
                      strokeWidth={2}
                      dot={{ fill: '#4A6741' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-[#2D3A2D]">
                    Revenue & Commission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
                      <XAxis dataKey="month" stroke="#5A6B5A" />
                      <YAxis stroke="#5A6B5A" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E8E0D5',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#6B8F5E" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="commission" fill="#4A6741" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-[#2D3A2D]">
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[250px]">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-[#4A6741] mb-2">4.9%</div>
                      <p className="text-[#5A6B5A]">Average conversion rate</p>
                      <div className="mt-4 flex items-center justify-center gap-1 text-green-600 font-medium">
                        <ArrowUpRight className="w-4 h-4" />
                        +0.8% from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#2D3A2D]">
                  Top Performing Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productData.map((product, index) => (
                    <div 
                      key={product.name}
                      className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center font-medium text-[#4A6741]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-[#2D3A2D]">{product.name}</p>
                          <p className="text-sm text-[#5A6B5A]">{product.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#2D3A2D]">${product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-[#5A6B5A]">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#2D3A2D]">
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {trafficSources.map((source) => (
                      <div 
                        key={source.name}
                        className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="font-medium text-[#2D3A2D]">{source.name}</span>
                        </div>
                        <span className="text-[#5A6B5A]">{source.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tier Progress */}
        <motion.div 
          className="mt-8 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-3xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-medium mb-1">Current Tier: Silver</h3>
              <p className="text-white/80">$8,000 / $15,000 to Gold tier</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">20%</p>
              <p className="text-white/80">Commission Rate</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: '53%' }}
            />
          </div>
          <p className="text-white/80 text-sm mt-3">
            $7,000 more in sales this month to unlock Gold tier (25% commission)
          </p>
        </motion.div>
      </div>
    </section>
  );
}