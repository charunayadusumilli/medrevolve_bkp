import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Save, DollarSign } from 'lucide-react';

export default function ProviderRateSettings() {
  const queryClient = useQueryClient();

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.Provider.filter({ is_active: true })
  });

  const { data: allRates = [] } = useQuery({
    queryKey: ['providerRates'],
    queryFn: () => base44.entities.ProviderRate.list()
  });

  const saveMutation = useMutation({
    mutationFn: async ({ providerId, providerName, rates, existingId }) => {
      const payload = {
        provider_id: providerId,
        provider_name: providerName,
        video_rate: Number(rates.video_rate),
        phone_rate: Number(rates.phone_rate),
        chat_rate: Number(rates.chat_rate),
        in_person_rate: Number(rates.in_person_rate),
        payment_timing: rates.payment_timing
      };
      if (existingId) {
        return base44.entities.ProviderRate.update(existingId, payload);
      }
      return base44.entities.ProviderRate.create(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['providerRates'] })
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#5A6B5A] mb-4">Set consultation rates for each provider. These rates will be used when creating checkout sessions.</p>

      {providers.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-[#5A6B5A]">No active providers found.</div>
      )}

      {providers.map(provider => {
        const existing = allRates.find(r => r.provider_id === provider.id);
        return (
          <ProviderRateCard
            key={provider.id}
            provider={provider}
            existing={existing}
            onSave={(rates) => saveMutation.mutate({
              providerId: provider.id,
              providerName: `${provider.name}, ${provider.title}`,
              rates,
              existingId: existing?.id
            })}
            saving={saveMutation.isPending}
          />
        );
      })}
    </div>
  );
}

function ProviderRateCard({ provider, existing, onSave, saving }) {
  const [rates, setRates] = useState({
    video_rate: existing?.video_rate ?? 99,
    phone_rate: existing?.phone_rate ?? 79,
    chat_rate: existing?.chat_rate ?? 49,
    in_person_rate: existing?.in_person_rate ?? 149,
    payment_timing: existing?.payment_timing ?? 'before'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onSave(rates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: 'video_rate', label: 'Video' },
    { key: 'phone_rate', label: 'Phone' },
    { key: 'chat_rate', label: 'Chat' },
    { key: 'in_person_rate', label: 'In-Person' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-[#2D3A2D]">{provider.name}, {provider.title}</h3>
          <p className="text-xs text-[#5A6B5A]">{provider.specialty}</p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className={`rounded-full ${saved ? 'bg-green-600 hover:bg-green-600' : 'bg-[#4A6741] hover:bg-[#3D5636]'} text-white`}
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {saved ? 'Saved!' : 'Save'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs text-[#5A6B5A] block mb-1">{f.label}</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5A6B5A] text-sm">$</span>
              <Input
                type="number"
                min="0"
                value={rates[f.key]}
                onChange={e => setRates(r => ({ ...r, [f.key]: e.target.value }))}
                className="pl-7 text-sm h-9"
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs text-[#5A6B5A] block mb-1">Payment Timing</label>
        <div className="flex gap-2">
          {['before', 'after', 'either'].map(t => (
            <button
              key={t}
              onClick={() => setRates(r => ({ ...r, payment_timing: t }))}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                rates.payment_timing === t ? 'bg-[#4A6741] text-white' : 'bg-[#F5F0E8] text-[#5A6B5A] hover:bg-[#E8DDD0]'
              }`}
            >
              Pay {t}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}