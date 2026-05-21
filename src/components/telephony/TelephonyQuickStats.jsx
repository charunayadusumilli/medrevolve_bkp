import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, PhoneIncoming, PhoneOutgoing, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function TelephonyQuickStats() {
  const { data: contactRequests } = useQuery({
    queryKey: ['ctm-stats'],
    queryFn: async () => {
      const all = await base44.entities.ContactRequest.list('-created_date', 50);
      return all.filter(r => ['ctm_call', 'ctm_form', 'ctm_text'].includes(r.source));
    },
  });

  const stats = {
    total: contactRequests?.length || 0,
    calls: contactRequests?.filter(r => r.source === 'ctm_call').length || 0,
    forms: contactRequests?.filter(r => r.source === 'ctm_form').length || 0,
    texts: contactRequests?.filter(r => r.source === 'ctm_text').length || 0,
  };

  return (
    <Card className="border-[#4A6741]/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#2D3A2D] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#4A6741]" />
              Telephony & Call Tracking
            </CardTitle>
            <CardDescription>CTM leads and call analytics</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link to="/TelephonyDashboard">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2D3A2D]">{stats.total}</div>
            <div className="text-xs text-[#5A6B5A]/70">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.calls}</div>
            <div className="text-xs text-[#5A6B5A]/70 flex items-center justify-center gap-1">
              <PhoneIncoming className="w-3 h-3" /> Calls
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.forms}</div>
            <div className="text-xs text-[#5A6B5A]/70 flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" /> Forms
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.texts}</div>
            <div className="text-xs text-[#5A6B5A]/70 flex items-center justify-center gap-1">
              <PhoneOutgoing className="w-3 h-3" /> Texts
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}