import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function GoLink() {
  const { code } = useParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await base44.entities.CampaignLink.filter({ code }, { limit: 1 });
      const link = (found.items || [])[0];
      if (cancelled) return;
      if (!link) { setFailed(true); return; }

      base44.entities.CampaignLink.update(link.id, {
        clicks: (link.clicks || 0) + 1,
        last_click_at: new Date().toISOString(),
      }).catch(() => {});

      if (link.campaign_id) {
        const campaign = await base44.entities.MarketingCampaign
          .get(link.campaign_id)
          .catch(() => null);
        if (campaign) {
          base44.entities.MarketingCampaign.update(campaign.id, { click_count: (campaign.click_count || 0) + 1 }).catch(() => {});
        }
      }

      window.location.replace(link.destination_url);
    })();
    return () => { cancelled = true; };
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {failed ? (
          <>
            <p className="text-sm font-semibold text-gray-900">This link has expired</p>
            <a href="https://medrevolve.com/shop" className="text-sm text-gray-500 underline mt-2 inline-block">Browse the store</a>
          </>
        ) : (
          <>
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Taking you to MedRevolve…</p>
          </>
        )}
      </div>
    </div>
  );
}