import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Lock, AlertCircle, Zap } from 'lucide-react';

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  trial: { label: 'Trial', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  past_due: { label: 'Past Due', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  pending: { label: 'Pending Setup', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

export default function ModuleCard({ module, moduleRecord, onActivate, onConfigure }) {
  const isEnabled = moduleRecord?.is_active;
  const hasRecord = !!moduleRecord;
  const status = moduleRecord?.status || null;
  const statusConfig = status ? STATUS_CONFIG[status] : null;
  const Icon = module.icon;

  return (
    <div className={`relative p-5 rounded-2xl border transition-all
      ${isEnabled
        ? 'bg-[#1A2A1A] border-[#4A6741]/50 shadow-lg shadow-[#4A6741]/10'
        : hasRecord
          ? 'bg-white/5 border-white/10'
          : 'bg-white/3 border-white/5 opacity-60'}`}>

      {module.popular && !isEnabled && (
        <span className="absolute -top-2 -right-2 bg-[#4A6741] text-white text-xs px-2 py-0.5 rounded-full font-semibold">Popular</span>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${isEnabled ? 'bg-[#4A6741]' : 'bg-white/10'}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-sm">{module.label}</h3>
            {statusConfig && (
              <Badge className={`text-xs border ${statusConfig.color}`}>{statusConfig.label}</Badge>
            )}
          </div>
          <p className="text-white/50 text-xs mt-0.5">{module.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold text-sm">{module.price === 0 ? 'Custom' : `$${module.price}`}</p>
          {module.price > 0 && <p className="text-white/30 text-xs">/mo</p>}
        </div>
      </div>

      <div className="flex gap-2">
        {isEnabled ? (
          <>
            <div className="flex items-center gap-1.5 text-green-400 text-xs flex-1">
              <Check className="w-3.5 h-3.5" /> Enabled & Active
            </div>
            {onConfigure && (
              <Button size="sm" variant="ghost" onClick={onConfigure}
                className="text-white/60 hover:text-white text-xs h-7 px-3">
                Configure
              </Button>
            )}
          </>
        ) : hasRecord ? (
          <>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs flex-1">
              <AlertCircle className="w-3.5 h-3.5" /> Setup Required
            </div>
            <Button size="sm" onClick={onActivate}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white text-xs h-7 px-3">
              <Zap className="w-3 h-3 mr-1" /> Activate
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-white/30 text-xs flex-1">
              <Lock className="w-3.5 h-3.5" /> Not subscribed
            </div>
            <Button size="sm" onClick={onActivate}
              className="bg-white/10 hover:bg-white/20 text-white text-xs h-7 px-3">
              Add Module
            </Button>
          </>
        )}
      </div>
    </div>
  );
}