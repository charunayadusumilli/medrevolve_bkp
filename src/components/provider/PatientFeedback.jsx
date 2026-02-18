import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function PatientFeedback({ provider }) {
  const testimonials = provider?.testimonials || [];

  if (testimonials.length === 0) {
    return (
      <Card className="border-[#E8E0D5]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#4A6741]" /> Patient Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-[#5A6B5A]">No patient reviews yet.</p>
            <p className="text-xs text-[#8A9A8A] mt-1">Reviews will appear here after consultations are completed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgRating = testimonials.reduce((s, t) => s + (t.rating || 0), 0) / testimonials.length;
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: testimonials.filter(t => Math.round(t.rating) === star).length,
    pct: Math.round((testimonials.filter(t => Math.round(t.rating) === star).length / testimonials.length) * 100)
  }));

  return (
    <Card className="border-[#E8E0D5]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#4A6741]" /> Patient Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-[#F5F0E8] rounded-xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2D3A2D]">{avgRating.toFixed(1)}</div>
            <StarRow rating={Math.round(avgRating)} />
            <p className="text-xs text-[#5A6B5A] mt-1">{testimonials.length} review{testimonials.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(d => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right text-[#5A6B5A]">{d.star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-6 text-[#5A6B5A]">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-[#E8E0D5] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#4A6741]/10 flex items-center justify-center text-xs font-bold text-[#4A6741]">
                    {t.patient_initials || 'P'}
                  </div>
                  <span className="text-sm font-medium text-[#2D3A2D]">{t.patient_initials || 'Patient'}</span>
                  {t.verified && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Verified</span>}
                </div>
                <div className="flex items-center gap-2">
                  <StarRow rating={t.rating || 5} />
                  {t.date && <span className="text-xs text-[#8A9A8A]">{t.date}</span>}
                </div>
              </div>
              {t.comment && <p className="text-sm text-[#5A6B5A] leading-relaxed">"{t.comment}"</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}