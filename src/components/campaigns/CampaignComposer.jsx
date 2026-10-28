import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, PhoneCall, Rocket } from "lucide-react";

const SEGMENTS = [
  { value: "consumer_weight_loss", label: "Consumer — Weight loss", scope: "consumer" },
  { value: "consumer_mens_health", label: "Consumer — Men's health", scope: "consumer" },
  { value: "consumer_womens_health", label: "Consumer — Women's health", scope: "consumer" },
  { value: "consumer_longevity", label: "Consumer — Longevity & peptides", scope: "consumer" },
  { value: "consumer_skincare", label: "Consumer — Skin & hair", scope: "consumer" },
  { value: "b2b_operator", label: "B2B — Clinic / med spa operators", scope: "ruo" },
  { value: "ruo_professional", label: "RUO — Research professionals", scope: "ruo" },
];

const inputClass = "w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10";

export default function CampaignComposer({ products, onSaved }) {
  const [scope, setScope] = useState("consumer");
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("sms");
  const [sku, setSku] = useState("");
  const [segment, setSegment] = useState("consumer_weight_loss");
  const [body, setBody] = useState("MedRevolve: your provider-reviewed plan is ready. Shop and check out here: {link}\nReply STOP to opt out.");
  const [script, setScript] = useState("This is MedRevolve calling with a quick update on your treatment plan. We are texting you the link right now.");
  const [campaign, setCampaign] = useState(null);
  const [audience, setAudience] = useState(null);
  const [testPhone, setTestPhone] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const productOptions = products.filter((p) => p.scope === scope);
  const segmentOptions = SEGMENTS.filter((s) => s.scope === scope);

  const changeScope = (next) => {
    setScope(next);
    setSku("");
    setCampaign(null);
    setAudience(null);
    setSegment(next === "ruo" ? "ruo_professional" : "consumer_weight_loss");
  };

  const save = async () => {
    setError("");
    const product = products.find((p) => p.value === sku);
    if (!name.trim() || !product) { setError("Give the campaign a name and pick a product."); return; }
    setBusy("save");
    try {
      const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
      const host = scope === "ruo" ? "https://medrevolveruo.com" : "https://medrevolve.com";
      const created = await base44.entities.MarketingCampaign.create({
        name: name.trim(), channel, segment, product_scope: scope,
        product_sku: product.value, product_name: product.name,
        destination_url: product.url, link_code: code, link_url: `${host}/go/${code}`,
        message_body: body, voice_script: script, status: "ready",
      });
      setCampaign(created);
      const res = await base44.functions.invoke("twilioCampaign", { action: "audience", campaign_id: created.id });
      setAudience(res.data);
      onSaved?.();
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally { setBusy(""); }
  };

  const run = async (action, phone) => {
    setError(""); setResult(null); setBusy(action);
    try {
      const res = await base44.functions.invoke("twilioCampaign", { action, campaign_id: campaign.id, phone });
      if (res.data?.error) setError(res.data.error);
      else setResult(res.data);
      onSaved?.();
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally { setBusy(""); }
  };

  const smsLength = body.replace("{link}", audience?.link || "").length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">New campaign</h2>
        <p className="text-sm text-gray-500">Pick a storefront, a product and an audience. The tracked link drops the customer straight on the product page where they can check out.</p>
      </div>

      <div className="flex gap-2">
        {[["consumer", "medrevolve.com"], ["ruo", "medrevolveruo.com"]].map(([value, label]) => (
          <button key={value} onClick={() => changeScope(value)}
            className={`px-4 py-2 text-sm rounded-sm border ${scope === value ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Campaign name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="November weight-loss push" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Channel</label>
          <select className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="sms">SMS only</option>
            <option value="voice">Voice call + SMS link</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Product</label>
          <select className={inputClass} value={sku} onChange={(e) => setSku(e.target.value)}>
            <option value="">Select a product…</option>
            {productOptions.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Audience segment</label>
          <select className={inputClass} value={segment} onChange={(e) => setSegment(e.target.value)}>
            {segmentOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">SMS copy — use {"{link}"} for the tracked product link</label>
        <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="rounded-sm" />
        <p className={`text-xs mt-1 ${smsLength > 160 ? "text-amber-600" : "text-gray-400"}`}>
          {smsLength} characters {smsLength > 160 ? `· ${Math.ceil(smsLength / 153)} segments` : "· 1 segment"}
        </p>
      </div>

      {channel === "voice" && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Voice script (spoken, then the link is texted during the call)</label>
          <Textarea rows={3} value={script} onChange={(e) => setScript(e.target.value)} className="rounded-sm" />
        </div>
      )}

      {campaign && (
        <div className="rounded-sm bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 space-y-1">
          <p><span className="text-gray-500">Tracked link:</span> <span className="font-mono break-all">{audience?.link}</span></p>
          <p><span className="text-gray-500">Consented contacts in segment:</span> {audience?.eligible ?? "—"}</p>
          {!audience?.configured && <p className="text-amber-700">Twilio credentials are not saved yet — sending is blocked until they are on the Secrets page.</p>}
        </div>
      )}

      {result && (
        <div className="rounded-sm bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          {result.sent !== undefined
            ? `Sent ${result.sent} of ${result.targeted} · ${result.failed} failed`
            : `Test queued to ${result.result?.to} · ${result.result?.ok ? "accepted by Twilio" : result.result?.error}`}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button onClick={save} disabled={busy === "save"} variant="outline" className="rounded-sm">
          {busy === "save" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save &amp; size audience
        </Button>
        {campaign && (
          <>
            <div className="flex items-center gap-2">
              <Input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+1 test number" className="rounded-sm w-44" />
              <Button onClick={() => run("test", testPhone)} disabled={busy === "test"} variant="outline" className="rounded-sm">
                {busy === "test" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PhoneCall className="w-4 h-4 mr-2" />} Send test
              </Button>
            </div>
            <Button onClick={() => run("launch")} disabled={busy === "launch"} className="rounded-sm bg-gray-900 text-white">
              {busy === "launch" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />} Launch to segment
            </Button>
          </>
        )}
      </div>
    </div>
  );
}