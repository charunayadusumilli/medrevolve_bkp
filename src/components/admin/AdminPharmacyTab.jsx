import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, ExternalLink, Mail } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminPharmacyTab({ pharmacies = [], onRefetch }) {
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const doAction = async (id, fn) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    await fn();
    setActionLoading(prev => ({ ...prev, [id]: false }));
    onRefetch?.();
  };

  const approve = (ph) => doAction(ph.id, () =>
    base44.entities.PharmacyIntake.update(ph.id, { status: 'approved' })
  );

  const underReview = (ph) => doAction(ph.id, () =>
    base44.entities.PharmacyIntake.update(ph.id, { status: 'under_review' })
  );

  const reject = (ph) => doAction(ph.id, () =>
    base44.entities.PharmacyIntake.update(ph.id, { status: 'rejected' })
  );

  if (!pharmacies.length) {
    return <p className="text-center text-muted-foreground py-8">No pharmacy applications yet.</p>;
  }

  return (
    <div className="space-y-3">
      {pharmacies.map(ph => {
        const isExpanded = expandedId === ph.id;
        const loading = actionLoading[ph.id];
        return (
          <Card key={ph.id} className={`transition-all ${ph.status === 'approved' ? 'border-green-200' : ph.status === 'rejected' ? 'border-red-200 opacity-60' : ''}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button
                      className="font-semibold text-[#2D3A2D] hover:underline text-left"
                      onClick={() => setExpandedId(isExpanded ? null : ph.id)}
                    >
                      {ph.pharmacy_name} {isExpanded ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />}
                    </button>
                    <Badge className={`text-xs ${STATUS_COLORS[ph.status] || 'bg-gray-100 text-gray-700'}`}>{ph.status}</Badge>
                    <Badge variant="outline" className="text-xs">{ph.pharmacy_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ph.contact_name} · {ph.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    License: {ph.license_number} · {ph.city && ph.state ? `${ph.city}, ${ph.state}` : 'Location N/A'} · Applied: {format(new Date(ph.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <a href={`mailto:${ph.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">
                    <Mail className="w-3 h-3" /> Email
                  </a>
                  {ph.status === 'pending' && (
                    <Button size="sm" variant="outline" disabled={loading}
                      className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => underReview(ph)}>
                      Mark Under Review
                    </Button>
                  )}
                  {(ph.status === 'pending' || ph.status === 'under_review') && (
                    <Button size="sm" disabled={loading}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => approve(ph)}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                    </Button>
                  )}
                  {ph.status !== 'rejected' && ph.status !== 'approved' && (
                    <Button size="sm" variant="outline" disabled={loading}
                      className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => reject(ph)}>
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Phone</span><br />{ph.phone || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">NPI</span><br />{ph.npi_number || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Shipping</span><br />{ph.shipping_capabilities || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">Address</span><br />{ph.address || '—'}</div>
                  <div><span className="font-medium text-xs text-gray-400 uppercase">ZIP</span><br />{ph.zip_code || '—'}</div>
                  <div>
                    <span className="font-medium text-xs text-gray-400 uppercase">Services</span><br />
                    <span className="text-xs">{ph.services_offered?.join(', ') || '—'}</span>
                  </div>
                  {ph.partnership_interest && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="font-medium text-xs text-gray-400 uppercase">Why Partner</span>
                      <p className="mt-1 text-gray-600 text-xs">{ph.partnership_interest}</p>
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