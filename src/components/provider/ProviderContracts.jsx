import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: Clock },
  suspended: { label: 'Suspended', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  terminated: { label: 'Terminated', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export default function ProviderContracts({ providerEmail }) {
  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['provider-contracts-user', providerEmail],
    queryFn: () => base44.entities.ProviderContract.filter({ contact_email: providerEmail }),
    enabled: !!providerEmail,
  });

  if (isLoading) return <p className="text-sm text-[#5A6B5A]">Loading contracts...</p>;

  if (contracts.length === 0) {
    return (
      <Card className="border-[#E8E0D5]">
        <CardContent className="py-12 text-center">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-[#5A6B5A]">No contracts found for your account.</p>
          <p className="text-xs text-[#8A9A8A] mt-1">Contact admin if you believe this is an error.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map(contract => {
        const cfg = STATUS_CONFIG[contract.status] || STATUS_CONFIG.draft;
        const Icon = cfg.icon;
        return (
          <Card key={contract.id} className="border-[#E8E0D5]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base text-[#2D3A2D]">{contract.provider_name}</CardTitle>
                  <p className="text-xs text-[#5A6B5A] mt-0.5 capitalize">{contract.contract_type?.replace('_', ' ')}</p>
                </div>
                <Badge className={`${cfg.color} border-none flex items-center gap-1`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {contract.rate_per_consultation > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-[#5A6B5A]">Per Consultation</p>
                      <p className="text-sm font-semibold text-[#2D3A2D]">${contract.rate_per_consultation}</p>
                    </div>
                  </div>
                )}
                {contract.monthly_retainer > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-[#5A6B5A]">Monthly Retainer</p>
                      <p className="text-sm font-semibold text-[#2D3A2D]">${contract.monthly_retainer}</p>
                    </div>
                  </div>
                )}
                {contract.revenue_share_percentage > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-[#5A6B5A]">Revenue Share</p>
                      <p className="text-sm font-semibold text-[#2D3A2D]">{contract.revenue_share_percentage}%</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-[#5A6B5A]">Consultations</p>
                    <p className="text-sm font-semibold text-[#2D3A2D]">{contract.total_consultations || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-[#5A6B5A]">Total Earned</p>
                    <p className="text-sm font-semibold text-[#2D3A2D]">${(contract.total_compensation_paid || 0).toLocaleString()}</p>
                  </div>
                </div>
                {contract.contract_start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4A6741]" />
                    <div>
                      <p className="text-xs text-[#5A6B5A]">Start Date</p>
                      <p className="text-sm font-semibold text-[#2D3A2D]">{format(parseISO(contract.contract_start_date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
                {contract.contract_end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-xs text-[#5A6B5A]">Expires</p>
                      <p className="text-sm font-semibold text-[#2D3A2D]">{format(parseISO(contract.contract_end_date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>

              {contract.services_provided?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider mb-2">Services Covered</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contract.services_provided.map((s, i) => (
                      <span key={i} className="text-xs bg-[#F5F0E8] text-[#4A6741] px-2.5 py-1 rounded-full border border-[#E8E0D5]">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {contract.states_licensed?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider mb-2">States Licensed</p>
                  <div className="flex flex-wrap gap-1">
                    {contract.states_licensed.map((s, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}