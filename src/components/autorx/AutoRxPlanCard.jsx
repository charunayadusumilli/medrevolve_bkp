import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Calendar, ChevronRight, CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { format, differenceInDays, isPast, parseISO } from 'date-fns';

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  paused: { label: 'Under Review', color: 'bg-amber-100 text-amber-800', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
  failed: { label: 'Action Required', color: 'bg-red-100 text-red-800', icon: AlertCircle }
};

export default function AutoRxPlanCard({ plan }) {
  const status = STATUS_CONFIG[plan.status] || STATUS_CONFIG.active;
  const StatusIcon = status.icon;

  const dueDate = plan.next_followup_due ? parseISO(plan.next_followup_due) : null;
  const daysUntilDue = dueDate ? differenceInDays(dueDate, new Date()) : null;
  const isOverdue = dueDate ? isPast(dueDate) : false;
  const isDueSoon = daysUntilDue !== null && daysUntilDue <= 5 && daysUntilDue >= 0;

  const completedMonths = (plan.cycles || []).filter(c => c.prescription_renewed).length;
  const progressPct = ((plan.current_month - 1) / plan.total_months) * 100;

  return (
    <div className={`bg-white rounded-2xl border-2 p-6 shadow-sm transition-all ${
      isOverdue && plan.status === 'active'
        ? 'border-amber-300'
        : plan.status === 'paused'
        ? 'border-amber-200'
        : 'border-[#E8E0D5]'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A6741]/10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-[#4A6741]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2D3A2D]">{plan.medication_name}</h3>
            {plan.dosage && <p className="text-xs text-[#5A6B5A]">{plan.dosage}</p>}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#5A6B5A] mb-1.5">
          <span>Month {plan.current_month} of {plan.total_months}</span>
          <span>{completedMonths} cycles complete</span>
        </div>
        <div className="w-full h-2 bg-[#F0EDE6] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full transition-all"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Next due */}
      {plan.status === 'active' && dueDate && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 mb-4 ${
          isOverdue
            ? 'bg-amber-50 border border-amber-200'
            : isDueSoon
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-[#F5F0E8]'
        }`}>
          <Calendar className={`w-4 h-4 flex-shrink-0 ${isOverdue ? 'text-amber-600' : isDueSoon ? 'text-blue-600' : 'text-[#4A6741]'}`} />
          <div>
            <p className={`text-xs font-semibold ${isOverdue ? 'text-amber-800' : isDueSoon ? 'text-blue-800' : 'text-[#2D3A2D]'}`}>
              {isOverdue ? 'Check-In Overdue' : isDueSoon ? 'Check-In Due Soon' : 'Next Check-In'}
            </p>
            <p className={`text-xs ${isOverdue ? 'text-amber-700' : 'text-[#5A6B5A]'}`}>
              {format(dueDate, 'MMMM d, yyyy')}
              {daysUntilDue !== null && !isOverdue && ` · ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} away`}
              {isOverdue && ` · ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue`}
            </p>
          </div>
        </div>
      )}

      {plan.status === 'paused' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">{plan.pause_reason || 'Your plan is under physician review. Our care team will contact you within 24 hours.'}</p>
        </div>
      )}

      {/* CTA */}
      {plan.status === 'active' && (
        <Link to={createPageUrl(`AutoRxFollowup?plan_id=${plan.id}`)}>
          <Button className={`w-full rounded-full font-semibold ${
            isOverdue || isDueSoon
              ? 'bg-[#4A6741] hover:bg-[#3D5636] text-white'
              : 'bg-[#4A6741]/10 hover:bg-[#4A6741]/20 text-[#4A6741]'
          }`}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {isOverdue ? 'Complete Overdue Check-In' : isDueSoon ? 'Complete Monthly Check-In' : 'Start Check-In Early'}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </Link>
      )}

      {plan.status === 'completed' && (
        <div className="flex items-center gap-2 text-sm text-[#4A6741] font-medium justify-center py-1">
          <CheckCircle2 className="w-4 h-4" />
          6-Month Plan Complete
        </div>
      )}
    </div>
  );
}