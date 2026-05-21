import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Mail, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  meeting_scheduled: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function AdminContactTab({ contacts = [], onRefetch }) {
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await base44.entities.ContactRequest.update(id, { status });
    setUpdatingId(null);
    onRefetch?.();
  };

  if (!contacts.length) {
    return <p className="text-center text-muted-foreground py-8">No contact requests yet.</p>;
  }

  return (
    <div className="space-y-3">
      {contacts.map(c => {
        const isExpanded = expandedId === c.id;
        return (
          <Card key={c.id} className={c.status === 'resolved' ? 'opacity-60' : ''}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button className="font-semibold text-[#2D3A2D] hover:underline text-left"
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                      {c.name} {isExpanded ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />}
                    </button>
                    <Badge className={`text-xs ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-700'}`}>{c.status}</Badge>
                    {c.source && c.source !== 'website_form' && (
                      <Badge variant="outline" className="text-xs">{c.source.replace(/_/g, ' ')}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.email}</p>
                  {c.subject && <p className="text-xs text-gray-500 mt-0.5">{c.subject?.replace(/\[Gmail:[^\]]+\]\s*/g, '')}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(c.created_date), 'MMM d, yyyy h:mm a')}</p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">
                    <Mail className="w-3 h-3" /> Reply
                  </a>
                  {c.meeting_link && (
                    <a href={c.meeting_link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-green-600 border border-green-200 rounded px-2 py-1 hover:bg-green-50">
                      <Calendar className="w-3 h-3" /> Meet
                    </a>
                  )}
                  <select
                    value={c.status || 'new'}
                    disabled={updatingId === c.id}
                    onChange={e => updateStatus(c.id, e.target.value)}
                    className="text-xs px-2 py-1 border rounded border-gray-200"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="meeting_scheduled">Meeting Scheduled</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              {isExpanded && c.message && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Message
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 max-h-48 overflow-auto text-xs leading-relaxed">
                    {c.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}