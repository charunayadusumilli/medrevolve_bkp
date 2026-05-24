import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { ChevronDown, ChevronUp, Mail, User, Calendar, Tag } from 'lucide-react';

const PRIORITY_STYLES = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
};

const STATUS_STYLES = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  review: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

const BUCKET_EMOJI = {
  support: '🎧',
  engineering: '⚙️',
  marketing: '📣',
  operations: '🏗️',
  compliance: '🛡️',
  product: '🎯',
  other: '📋',
};

export default function TicketCard({ ticket, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [assignEmail, setAssignEmail] = useState(ticket.assigned_to_email || '');
  const [assignName, setAssignName] = useState(ticket.assigned_to_name || '');
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await base44.entities.Ticket.update(ticket.id, { status: newStatus });
    onUpdate?.();
  };

  const handleAssign = async () => {
    setSaving(true);
    await base44.functions.invoke('assignTicket', {
      ticket_id: ticket.id,
      assigned_to_email: assignEmail,
      assigned_to_name: assignName,
    });
    setSaving(false);
    onUpdate?.();
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setAddingComment(true);
    const existing = ticket.comments || [];
    await base44.entities.Ticket.update(ticket.id, {
      comments: [...existing, {
        author: 'Admin',
        text: comment,
        timestamp: new Date().toISOString(),
      }]
    });
    setComment('');
    setAddingComment(false);
    onUpdate?.();
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all ${
      ticket.priority === 'urgent' ? 'border-l-4 border-l-red-500' :
      ticket.priority === 'high' ? 'border-l-4 border-l-orange-400' : 'border border-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-base">{BUCKET_EMOJI[ticket.bucket] || '📋'}</span>
              <span className="font-semibold text-gray-900 text-sm">{ticket.title}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.medium}`}>
                {ticket.priority?.toUpperCase()}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.open}`}>
                {status?.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-xs text-gray-400 capitalize">{ticket.bucket}</span>
              {ticket.source === 'meeting_transcript' && (
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">🎙️ From Meeting</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {ticket.assigned_to_name && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">{ticket.assigned_to_name}</span>
              </div>
            )}
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-700 transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {ticket.description && (
            <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
          )}

          {ticket.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3 h-3 text-gray-400" />
              {ticket.tags.map(t => (
                <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t}</span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status */}
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Change Status</label>
              <select
                value={status}
                onChange={e => handleStatusChange(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Assign */}
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Assigned To</label>
              <div className="flex gap-1">
                <input
                  type="email"
                  value={assignEmail}
                  onChange={e => setAssignEmail(e.target.value)}
                  placeholder="email@medrevolve.com"
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <Button size="sm" onClick={handleAssign} disabled={saving} className="bg-[#4A6741] hover:bg-[#3d5636] text-white text-xs px-2">
                  <Mail className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          {ticket.comments?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">Comments</p>
              {ticket.comments.map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">{c.author}</span>
                    <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <Button size="sm" onClick={handleAddComment} disabled={addingComment || !comment.trim()} variant="outline" className="text-xs">
              Add
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Created: {new Date(ticket.created_date).toLocaleDateString()}</span>
            {ticket.reporter_email && <span>Reporter: {ticket.reporter_email}</span>}
            {ticket.email_sent && <span className="text-green-600">✓ Email sent</span>}
          </div>
        </div>
      )}
    </div>
  );
}