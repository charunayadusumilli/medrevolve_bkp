import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";

const statusStyles = {
  draft: "bg-gray-100 text-gray-600",
  ready: "bg-blue-50 text-blue-700",
  sending: "bg-amber-50 text-amber-700",
  sent: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  paused: "bg-gray-100 text-gray-500",
};

export default function CampaignTable({ campaigns }) {
  if (!campaigns.length) {
    return <p className="text-sm text-gray-500 bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center">No campaigns yet. Build the first one above.</p>;
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="text-left font-semibold px-4 py-3">Campaign</th>
            <th className="text-left font-semibold px-4 py-3">Channel</th>
            <th className="text-left font-semibold px-4 py-3">Product</th>
            <th className="text-right font-semibold px-4 py-3">Targeted</th>
            <th className="text-right font-semibold px-4 py-3">Sent</th>
            <th className="text-right font-semibold px-4 py-3">Failed</th>
            <th className="text-right font-semibold px-4 py-3">Clicks</th>
            <th className="text-left font-semibold px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {campaigns.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50/60">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.segment?.replace(/_/g, " ")}</p>
              </td>
              <td className="px-4 py-3 text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  {c.channel === "voice" ? <PhoneCall className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                  {c.channel === "voice" ? "Voice + SMS" : "SMS"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{c.product_name || "—"}</td>
              <td className="px-4 py-3 text-right text-gray-700">{c.targeted_count || 0}</td>
              <td className="px-4 py-3 text-right text-gray-700">{c.sent_count || 0}</td>
              <td className="px-4 py-3 text-right text-gray-700">{c.failed_count || 0}</td>
              <td className="px-4 py-3 text-right text-gray-700">{c.click_count || 0}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-semibold ${statusStyles[c.status] || statusStyles.draft}`}>{c.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}