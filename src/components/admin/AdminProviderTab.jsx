import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Send, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminProviderTab({ providers = [], onRefetch }) {
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const doAction = async (id, fn) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    await fn();
    setActionLoading(prev => ({ ...prev, [id]: false }));
    onRefetch?.();
  };

  const sendQualiphyInvite = (p) => doAction(p.id, async () => {
    await base44.functions.invoke('qualiphySendInvite', { email: p.email, name: p.full_name });
    await base44.entities.ProviderIntake.update(p.id, { status: 'under_review' });
  });

  const approve = (p) => doAction(p.id, () =>
    base44.entities.ProviderIntake.update(p.id, { status: 'approved' })
  );

  const reject = (p) => doAction(p.id, () =>
    base44.entities.ProviderIntake.update(p.id, { status: 'rejected' })
  );

  if (!providers.length) {
    return <p className="text-center text-muted-foreground py-8">No provider applications yet.</p>;
  }

  return (
    <div className="space-y-3">
      {providers.map(p => {
        const isExpanded = expandedId === p.id;
        const loading = actionLoading[p.id];
        return (
          <Card key={p.id} className={`transition-all ${p.status === 'approved' ? 'border-green-200' : p.status === 'rejected' ? 'border-red-200 opacity-60' : ''}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button
                      className="font-semibold text-[#2D3A2D] hover:underline text-left"
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    >
                      {p.full_name}, {p.title} {isExpanded ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />}
                    </button>
                    <Badge className={`text-xs ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-700'}`}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.email} · {p.specialty}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    License: {p.license_number} · {p.states_licensed?.join(', ') || 'N/A'} · Applied: {format(new Date(p.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">
                    <ExternalLink className="w-3 h-3" /> Email
                  </a>
                  {p.status === 'pending' && (
                    <Button size="sm" variant="outline" disabled={loading}
                      className="text-xs border-violet-300 text-violet-700 hover:bg-violet-50"
                      onClick={() => sendQualiphyInvite(p)}>
                      <Send className="w-3 h-3 mr-1" /> Qualiphy Exam
                    </Button>
                  )}
                  {(p.status === 'pending' || p.status === 'under_review') && (
                    <Button size="sm" disabled={loading}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => approve(p)}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                    </Button>
                  )}
                  {p.status !== 'rejected' && p.status !== 'approved' && (
                    <Button size="sm" variant="outline" disabled={loading}
                      className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => reject(p)}>
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Phone</span><br />{p.phone || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Practice Type</span><br />{p.practice_type || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Years Exp</span><br />{p.years_experience || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Availability</span><br />{p.availability || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Certifications</span><br />{p.certifications || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Education</span><br />{p.education || '—'}</div>
                  {p.bio && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="font-medium text-xs text-gray-400 uppercase">Bio</span>
                      <p className="mt-1 text-gray-600 text-xs">{p.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}