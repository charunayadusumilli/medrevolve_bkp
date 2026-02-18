import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Clock, FileText, DollarSign, Star, Users } from 'lucide-react';

export default function ProviderStatsCards({ provider, appointments, consultations, contracts }) {
  const todayApts = appointments.filter(a =>
    new Date(a.appointment_date).toDateString() === new Date().toDateString()
  );
  const upcomingApts = appointments.filter(a =>
    ['scheduled', 'confirmed'].includes(a.status) && new Date(a.appointment_date) >= new Date()
  );
  const completedApts = appointments.filter(a => a.status === 'completed');

  // Earnings: sum from active contracts
  const totalEarnings = contracts.reduce((sum, c) => sum + (c.total_compensation_paid || 0), 0);
  const activeContract = contracts.find(c => c.status === 'active');
  const ratePerConsult = activeContract?.rate_per_consultation || activeContract?.monthly_retainer || 0;

  // Unique patients
  const uniquePatients = new Set(appointments.map(a => a.patient_email)).size;

  const stats = [
    {
      label: "Today's Appointments",
      value: todayApts.length,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Upcoming',
      value: upcomingApts.length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Total Consultations',
      value: completedApts.length || provider?.total_consultations || 0,
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Unique Patients',
      value: uniquePatients,
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Avg Rating',
      value: provider?.rating ? `${provider.rating} ★` : 'N/A',
      icon: Star,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="border-[#E8E0D5]">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-[#2D3A2D]">{s.value}</p>
              <p className="text-xs text-[#5A6B5A] mt-0.5 leading-tight">{s.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}