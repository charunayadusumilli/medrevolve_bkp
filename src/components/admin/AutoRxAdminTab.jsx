import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp,
  Mail, DollarSign, Clock, Calendar, Pill, User, Filter,
  Play, Pause, XCircle, Send
} from 'lucide-react';
import { format, differenceInDays, isPast, parseISO } from 'date-fns';

const STATUS_CONFIG = {
  active:    { label: 'Active',          color: 'bg-green-100 text-green-800 border-green-200',  icon: CheckCircle2 },
  paused:    { label: 'Under Review',    color: 'bg-amber-100 text-amber-800 border-amber-200',  icon: AlertCircle  },
  completed: { label: 'Completed',       color: 'bg-blue-100 text-blue-800 border-blue-200',     icon: CheckCircle2 },
  cancelled: { label: 'Cancelled',       color: 'bg-gray-100 text-gray-700 border-gray-200',     icon: XCircle      },
  failed:    { label: 'Action Required', color: 'bg-red-100 text-red-800 border-red-200',        icon: AlertCircle  }
};

function CycleHistory({ cycles = [] }) {
  if (!cycles.length) return <p className="text-sm text-gray-400 italic py-2">No cycle history yet.</p>;
  return (
    <div className="space-y-2 mt-3">
      {[...cycles].reverse().map((c, i) => (
        <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 text-xs">
          <div className="w-6 h-6 rounded-full bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0 font-bold text-[#4A6741]">
            {c.month}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1">
              {c.prescription_renewed && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Rx Renewed</span>}
              {c.billing_triggered    && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Billed</span>}
              {c.shipment_triggered   && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Shipped</span>}
              {c.error                && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Error</span>}
            </div>
            {c.submitted_at && (
              <p className="text-gray-500">Submitted: {format(new Date(c.submitted_at), 'MMM d, yyyy h:mm a')}</p>
            )}
            {c.due_date && !c.submitted_at && (
              <p className="text-amber-600">Due: {format(new Date(c.due_date), 'MMM d, yyyy')} — Not submitted</p>
            )}
            {c.beluga_response_status && (
              <p className="text-gray-500">Beluga: {c.beluga_response_status}</p>
            )}
            {c.error && <p className="text-red-600 truncate">{c.error}</p>}
            {c.notes && <p className="text-gray-600 mt-1 italic">{c.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function AutoRxPlanRow({ plan }) {
  const [expanded, setExpanded]   = useState(false);
  const [noteText, setNoteText]   = useState(plan.notes || '');
  const [savingNote, setSavingNote] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const qc = useQueryClient();

  const status     = STATUS_CONFIG[plan.status] || STATUS_CONFIG.active;
  const StatusIcon = status.icon;

  const dueDate      = plan.next_followup_due ? parseISO(plan.next_followup_due) : null;
  const daysUntilDue = dueDate ? differenceInDays(dueDate, new Date()) : null;
  const isOverdue    = dueDate ? isPast(dueDate) && plan.status === 'active' : false;

  const invalidate = () => qc.invalidateQueries(['autoRxPlans']);

  const updateStatus = async (newStatus, extra = {}) => {
    setActionLoading(newStatus);
    await base44.entities.AutoRxPlan.update(plan.id, { status: newStatus, ...extra });
    invalidate();
    setActionLoading(null);
  };

  const sendReminder = async () => {
    setActionLoading('reminder');
    await base44.functions.invoke('sendAutoRxFollowupReminders', { force_plan_id: plan.id });
    invalidate();
    setActionLoading(null);
  };

  const triggerBilling = async () => {
    setActionLoading('billing');
    await base44.functions.invoke('triggerAutoRxBilling', { plan_id: plan.id, admin_override: true });
    invalidate();
    setActionLoading(null);
  };

  const saveNote = async () => {
    setSavingNote(true);
    await base44.entities.AutoRxPlan.update(plan.id, { notes: noteText });
    invalidate();
    setSavingNote(false);
  };

  return (
    <Card className={`border ${isOverdue ? 'border-amber-300' : plan.status === 'paused' ? 'border-amber-200' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        {/* Summary row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0">
            <Pill className="w-4 h-4 text-[#4A6741]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#2D3A2D] text-sm">{plan.medication_name}</span>
              {plan.dosage && <span className="text-xs text-gray-500">{plan.dosage}</span>}
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
                <StatusIcon className="w-3 h-3" /> {status.label}
              </span>
              {isOverdue && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {Math.abs(daysUntilDue)}d overdue
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {plan.patient_name || plan.patient_email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Month {plan.current_month}/{plan.total_months}</span>
              {dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-amber-600' : ''}`}>
                  <Clock className="w-3 h-3" />
                  {isOverdue ? 'Was due' : 'Due'} {format(dueDate, 'MMM d')}
                </span>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {plan.status === 'active' && (
              <>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                  disabled={actionLoading === 'reminder'}
                  onClick={sendReminder}>
                  {actionLoading === 'reminder' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                  Remind
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                  disabled={actionLoading === 'billing'}
                  onClick={triggerBilling}>
                  {actionLoading === 'billing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
                  Bill
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                  disabled={!!actionLoading}
                  onClick={() => updateStatus('paused')}>
                  <Pause className="w-3 h-3" /> Pause
                </Button>
              </>
            )}
            {plan.status === 'paused' && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50"
                disabled={!!actionLoading}
                onClick={() => updateStatus('active')}>
                <Play className="w-3 h-3" /> Resume
              </Button>
            )}
            {(plan.status === 'active' || plan.status === 'paused') && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50"
                disabled={!!actionLoading}
                onClick={() => updateStatus('cancelled')}>
                <XCircle className="w-3 h-3" /> Cancel
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full"
            style={{ width: `${Math.min(((plan.current_month - 1) / plan.total_months) * 100, 100)}%` }}
          />
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
              <div><span className="font-medium text-gray-800">Patient:</span> {plan.patient_email}</div>
              {plan.plan_start_date && <div><span className="font-medium text-gray-800">Started:</span> {format(new Date(plan.plan_start_date), 'MMM d, yyyy')}</div>}
              {plan.plan_end_date   && <div><span className="font-medium text-gray-800">Ends:</span>   {format(new Date(plan.plan_end_date), 'MMM d, yyyy')}</div>}
              {plan.stripe_subscription_id && <div><span className="font-medium text-gray-800">Stripe Sub:</span> {plan.stripe_subscription_id}</div>}
              {plan.beluga_visit_id        && <div><span className="font-medium text-gray-800">Beluga Visit:</span> {plan.beluga_visit_id}</div>}
              {plan.pause_reason           && <div className="col-span-2 text-amber-700"><span className="font-medium text-amber-900">Pause Reason:</span> {plan.pause_reason}</div>}
              {plan.cancel_reason          && <div className="col-span-2 text-red-700"><span className="font-medium text-red-900">Cancel Reason:</span> {plan.cancel_reason}</div>}
            </div>

            {/* Cycle history */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Cycle History</h4>
              <CycleHistory cycles={plan.cycles} />
            </div>

            {/* Internal notes */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Internal Notes</h4>
              <Textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add internal notes visible only to admins..."
                className="text-sm rounded-xl border-gray-200 h-20 resize-none"
              />
              <Button size="sm" className="mt-2 h-7 text-xs bg-[#4A6741] hover:bg-[#3D5636] text-white"
                disabled={savingNote || noteText === (plan.notes || '')}
                onClick={saveNote}>
                {savingNote ? <RefreshCw className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                Save Note
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AutoRxAdminTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  const qc = useQueryClient();

  const { data: plans = [], isLoading, refetch } = useQuery({
    queryKey: ['autoRxPlans'],
    queryFn: () => base44.entities.AutoRxPlan.list('-created_date', 200)
  });

  const filtered = statusFilter === 'all' ? plans : plans.filter(p => p.status === statusFilter);

  const counts = {
    all:       plans.length,
    active:    plans.filter(p => p.status === 'active').length,
    paused:    plans.filter(p => p.status === 'paused').length,
    completed: plans.filter(p => p.status === 'completed').length,
    cancelled: plans.filter(p => p.status === 'cancelled').length,
    failed:    plans.filter(p => p.status === 'failed').length,
  };

  const overdue = plans.filter(p =>
    p.status === 'active' && p.next_followup_due && isPast(parseISO(p.next_followup_due))
  ).length;

  const FILTERS = [
    { key: 'all',       label: 'All' },
    { key: 'active',    label: 'Active' },
    { key: 'paused',    label: 'Under Review' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'failed',    label: 'Failed' },
  ];

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Plans',     value: counts.all,       color: 'bg-gray-50 border-gray-200' },
          { label: 'Active',          value: counts.active,    color: 'bg-green-50 border-green-200' },
          { label: 'Overdue Check-In',value: overdue,          color: overdue > 0 ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200' },
          { label: 'Under Review',    value: counts.paused,    color: counts.paused > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
            <p className="text-2xl font-bold text-[#2D3A2D]">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              statusFilter === f.key
                ? 'bg-[#4A6741] text-white border-[#4A6741]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#4A6741]/50'
            }`}
          >
            {f.label} <span className="ml-1 opacity-70">({counts[f.key]})</span>
          </button>
        ))}
        <Button size="sm" variant="ghost" className="ml-auto text-xs gap-1 h-7" onClick={() => refetch()}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      {/* Plan list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading AutoRx plans...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Pill className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No plans found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(plan => (
            <AutoRxPlanRow key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}