import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import CampaignComposer from "@/components/campaigns/CampaignComposer";
import CampaignTable from "@/components/campaigns/CampaignTable";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function CampaignStudio() {
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [campaignPage, storefrontPage, ruoPage, status] = await Promise.all([
      base44.entities.MarketingCampaign.filter({}, { sort: "-created_date", limit: 50 }),
      base44.entities.StorefrontProduct.filter({}, { limit: 200 }),
      base44.entities.RUOProduct.filter({}, { limit: 200 }),
      base44.functions.invoke("twilioCampaign", { action: "status" }).catch(() => null),
    ]);
    setCampaigns(campaignPage.items || []);
    setProducts([
      ...(storefrontPage.items || []).map((p) => ({
        value: p.sku, label: p.display_name, name: p.display_name, scope: "consumer",
        url: `https://medrevolve.com/product/${p.slug}`,
      })),
      ...(ruoPage.items || []).map((p) => ({
        value: p.sku, label: `${p.name} · ${p.size || ""}`, name: p.name, scope: "ruo",
        url: `https://medrevolveruo.com/ruo/${p.slug}`,
      })),
    ]);
    setConnection(status?.data ?? { connected: false, configured: false, reason: 'Could not reach the campaign service.' });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Campaign Studio</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">SMS &amp; voice campaigns</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Build an audience, attach a tracked product link, and reach it by text or by call. Every link lands on the product page where the customer can check out and pay.
          </p>
        </div>

        {connection?.connected ? (
          <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Connected to Twilio{connection.account_name ? ` — ${connection.account_name}` : ''} · account status {connection.account_status || 'unknown'} · sending from {connection.from}. US marketing texts still require the number to be registered for A2P 10DLC, or carriers will filter them.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Not connected to Twilio. {connection?.reason || 'Checking credentials…'} Campaigns still build and size their audience, but nothing sends until the account SID, API key SID, client secret and sending number on the Secrets page are accepted by Twilio.
            </p>
          </div>
        )}

        <CampaignComposer products={products} onSaved={load} />
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Campaigns</h2>
          <CampaignTable campaigns={campaigns} />
        </div>
      </div>
    </div>
  );
}