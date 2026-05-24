import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';

const BUCKETS = ['support', 'engineering', 'marketing', 'operations', 'compliance', 'product', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function NewTicketModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    bucket: 'support',
    priority: 'medium',
    assigned_to_email: '',
    assigned_to_name: '',
    due_date: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    const ticket = await base44.entities.Ticket.create({
      ...form,
      status: 'open',
      source: 'manual',
      email_sent: false,
    });

    // Send assignment email if assigned
    if (form.assigned_to_email) {
      await base44.functions.invoke('assignTicket', {
        ticket_id: ticket.id,
        assigned_to_email: form.assigned_to_email,
        assigned_to_name: form.assigned_to_name,
      });
    }

    setSaving(false);
    onCreated?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-gray-900">Create New Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Brief description of the issue or task"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Detailed description..."
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Bucket</label>
              <select
                value={form.bucket}
                onChange={e => setForm(f => ({ ...f, bucket: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white capitalize"
              >
                {BUCKETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white capitalize"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Assign To (Name)</label>
              <input
                type="text"
                value={form.assigned_to_name}
                onChange={e => setForm(f => ({ ...f, assigned_to_name: e.target.value }))}
                placeholder="Team member name"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Assign To (Email)</label>
              <input
                type="email"
                value={form.assigned_to_email}
                onChange={e => setForm(f => ({ ...f, assigned_to_email: e.target.value }))}
                placeholder="email@medrevolve.com"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving || !form.title.trim()} className="flex-1 bg-[#4A6741] hover:bg-[#3d5636] text-white">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}