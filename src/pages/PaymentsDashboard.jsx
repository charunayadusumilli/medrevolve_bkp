import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import RequireAuth from '@/components/auth/RequireAuth';
import ProviderRateSettings from '@/components/payments/ProviderRateSettings';
import {
  DollarSign, FileText, CreditCard, CheckCircle,
  Clock, XCircle, Download, ChevronRight, TrendingUp
} from 'lucide-react';

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  waived: { label: 'Waived', color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
};

export default function PaymentsDashboard() {
  const [tab, setTab] = useState('payments');

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => base44.auth.me() });
  const isAdmin = user?.role === 'admin';

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['consultationPayments', user?.email, isAdmin],
    queryFn: () => isAdmin
      ? base44.entities.ConsultationPayment.list('-created_date', 100)
      : base44.entities.ConsultationPayment.filter({ patient_email: user?.email }, '-created_date', 50),
    enabled: !!user
  });

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);
  const totalCount = payments.length;

  const handleViewInvoice = async (paymentId) => {
    const { data } = await base44.functions.invoke('generateInvoice', { paymentId });
    const blob = new Blob([data], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <RequireAuth portalName="Payments">
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="bg-gradient-to-br from-[#4A6741] to-[#3D5636] text-white py-10 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-light mb-1">Payments & Invoices</h1>
            <p className="text-white/70 text-sm">Track consultation payments and download invoices</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { label: 'Total Paid', value: `$${totalPaid.toFixed(2)}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pending', value: `$${totalPending.toFixed(2)}`, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Total Transactions', value: totalCount, icon: CreditCard, color: 'text-[#4A6741]', bg: 'bg-[#D4E5D7]/40' }
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#2D3A2D]">{stat.value}</p>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          {isAdmin && (
            <div className="flex gap-2 mb-6">
              {['payments', 'rates'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === t ? 'bg-[#4A6741] text-white' : 'bg-white text-[#5A6B5A] hover:bg-[#F5F0E8]'}`}
                >
                  {t === 'payments' ? 'All Payments' : 'Provider Rates'}
                </button>
              ))}
            </div>
          )}

          {tab === 'rates' && isAdmin ? (
            <ProviderRateSettings />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-medium text-[#2D3A2D]">
                  {isAdmin ? 'All Consultation Payments' : 'My Payments'}
                </h2>
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-[#5A6B5A]">Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="p-16 text-center">
                  <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-[#5A6B5A]">No payments yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {payments.map((payment) => {
                    const sc = statusConfig[payment.status] || statusConfig.pending;
                    const StatusIcon = sc.icon;
                    return (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between px-5 py-4 hover:bg-[#FDFBF7] transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#D4E5D7]/50 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-[#4A6741]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#2D3A2D] text-sm capitalize">
                              {payment.consultation_type?.replace('_', ' ')} Consultation
                            </p>
                            {isAdmin && (
                              <p className="text-xs text-[#5A6B5A] truncate">{payment.patient_email}</p>
                            )}
                            <p className="text-xs text-[#5A6B5A]">
                              {payment.provider_name || '—'} · {payment.invoice_number}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          <span className="font-semibold text-[#2D3A2D] text-sm">${(payment.amount || 0).toFixed(2)}</span>
                          <Badge className={`${sc.color} border-none text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {sc.label}
                          </Badge>
                          <div className="text-xs text-[#5A6B5A] hidden sm:block w-24 text-right">
                            {new Date(payment.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {payment.status === 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#4A6741] hover:bg-[#4A6741]/10 rounded-full"
                              onClick={() => handleViewInvoice(payment.id)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Invoice
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}