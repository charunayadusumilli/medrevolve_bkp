import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MousePointerClick, Target, ShoppingCart } from 'lucide-react';

function groupCounts(items, keyFn) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item) || 'direct';
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function Bar({ label, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium truncate">{label}</span>
        <span className="text-gray-500">{count} ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div className="h-full bg-[#A66B3C] rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Traffic, attribution and funnel view built from TrafficEvent records. */
export default function TrafficOverview() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.TrafficEvent
      .list({ sort: '-created_date', limit: 2000 })
      .then((page) => {
        if (!cancelled) setEvents(page.items || []);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    return () => { cancelled = true; };
  }, []);

  if (!events) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-gray-400">Loading traffic events...</CardContent>
      </Card>
    );
  }

  const pageViews = events.filter((e) => e.event_type === 'page_view');
  const ctaClicks = events.filter((e) => e.event_type === 'cta_click');
  const checkouts = events.filter((e) => e.event_type === 'checkout_start');
  const leads = events.filter((e) => e.event_type === 'referral' || e.event_type === 'form_submit');

  const bySource = groupCounts(pageViews, (e) => e.utm_source || e.ref_code);
  const byCampaign = groupCounts(pageViews, (e) => e.utm_campaign);
  const byCtaSource = groupCounts(ctaClicks, (e) => e.utm_source || e.ref_code);

  const servicesBySource = new Map();
  ctaClicks.forEach((event) => {
    if (!event.service_interest) return;
    const source = event.utm_source || event.ref_code || 'direct';
    if (!servicesBySource.has(source)) servicesBySource.set(source, new Map());
    const inner = servicesBySource.get(source);
    inner.set(event.service_interest, (inner.get(event.service_interest) || 0) + 1);
  });

  const funnel = [
    { label: 'Page views', value: pageViews.length, icon: Globe },
    { label: 'CTA clicks', value: ctaClicks.length, icon: MousePointerClick },
    { label: 'Checkout starts', value: checkouts.length, icon: ShoppingCart },
    { label: 'Forms / referrals', value: leads.length, icon: Target },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {funnel.map((step) => (
          <Card key={step.label}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{step.label}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-900">{step.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1F2D27]">
                  <step.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" /> Traffic by source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bySource.length ? (
              bySource.slice(0, 10).map(([source, count]) => (
                <Bar key={source} label={source} count={count} total={pageViews.length} />
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No page views recorded yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" /> Traffic by campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byCampaign.length ? (
              byCampaign.slice(0, 10).map(([campaign, count]) => (
                <Bar key={campaign} label={campaign} count={count} total={pageViews.length} />
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No campaign-tagged traffic yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Funnel: page view → CTA click → checkout start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {funnel.slice(0, 3).map((step, index) => {
            const previous = index === 0 ? step.value : funnel[index - 1].value;
            const rate = previous ? Math.round((step.value / previous) * 100) : 0;
            return (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-gray-500">
                    {step.value} {index > 0 && `· ${rate}% of previous`}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full bg-[#1F2D27]"
                    style={{ width: `${pageViews.length ? (step.value / pageViews.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {byCtaSource.slice(0, 6).map(([source]) => {
              const services = [...(servicesBySource.get(source) || new Map()).entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2);
              return (
                <div key={source} className="border border-gray-100 rounded-lg p-3">
                  <p className="text-sm font-semibold capitalize">{source}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {services.length ? (
                      services.map(([service, count]) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service} · {count}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">no service clicks yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}