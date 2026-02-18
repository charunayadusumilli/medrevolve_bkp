import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronDown, ChevronUp, Loader2, CheckCircle2, Copy, RefreshCw } from 'lucide-react';

export default function AIClinicalAssistant({ notes, patientEmail, onApply }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { summary, icd_codes, follow_up }
  const [edited, setEdited] = useState(null);
  const [applied, setApplied] = useState(false);

  const generate = async () => {
    if (!notes?.trim()) return;
    setLoading(true);
    setResult(null);
    setEdited(null);
    setApplied(false);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a clinical assistant helping a licensed telehealth provider document a consultation.

Based on the following consultation notes, provide:
1. A concise clinical summary (2-4 sentences, professional SOAP-style)
2. Up to 4 relevant ICD-10 diagnosis codes with descriptions
3. Draft follow-up instructions for the patient (clear, plain English, 3-5 bullet points)

Consultation Notes:
"""
${notes}
"""

Patient: ${patientEmail || 'Unknown'}`,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string', description: 'Clinical consultation summary' },
            icd_codes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            follow_up: { type: 'string', description: 'Follow-up instructions for the patient as plain text with newlines' }
          }
        }
      });
      setResult(res);
      setEdited({ summary: res.summary, icd_codes: res.icd_codes, follow_up: res.follow_up });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApply(edited);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="border border-purple-200 bg-purple-50/40 rounded-xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-purple-800">
          <Sparkles className="w-4 h-4" />
          AI Clinical Assistant
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-xs text-purple-700">
            Generate a clinical summary, ICD-10 codes, and follow-up instructions from your notes. Review and edit before saving.
          </p>

          <Button
            size="sm"
            disabled={loading || !notes?.trim()}
            onClick={generate}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs"
          >
            {loading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Analyzing…</> : <><Sparkles className="w-3.5 h-3.5 mr-1.5" />{result ? 'Regenerate' : 'Generate from Notes'}</>}
          </Button>

          {!notes?.trim() && (
            <p className="text-xs text-purple-500 italic">Add consultation notes above to enable AI assistance.</p>
          )}

          {edited && (
            <div className="space-y-4 pt-1">
              {/* Summary */}
              <div>
                <label className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  Clinical Summary
                  <Badge className="bg-purple-100 text-purple-600 border-none text-[10px]">AI</Badge>
                </label>
                <textarea
                  value={edited.summary}
                  onChange={e => setEdited(d => ({ ...d, summary: e.target.value }))}
                  rows={3}
                  className="w-full text-sm rounded-lg border border-purple-200 bg-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                />
              </div>

              {/* ICD-10 Codes */}
              <div>
                <label className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  ICD-10 Codes
                  <Badge className="bg-purple-100 text-purple-600 border-none text-[10px]">AI</Badge>
                </label>
                <div className="space-y-2">
                  {edited.icd_codes?.map((code, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={code.code}
                        onChange={e => setEdited(d => {
                          const codes = [...d.icd_codes];
                          codes[i] = { ...codes[i], code: e.target.value };
                          return { ...d, icd_codes: codes };
                        })}
                        className="w-24 text-xs font-mono rounded-lg border border-purple-200 bg-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-300"
                        placeholder="E.g. E11.9"
                      />
                      <input
                        value={code.description}
                        onChange={e => setEdited(d => {
                          const codes = [...d.icd_codes];
                          codes[i] = { ...codes[i], description: e.target.value };
                          return { ...d, icd_codes: codes };
                        })}
                        className="flex-1 text-xs rounded-lg border border-purple-200 bg-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-300"
                        placeholder="Description"
                      />
                      <button onClick={() => setEdited(d => ({ ...d, icd_codes: d.icd_codes.filter((_, j) => j !== i) }))} className="text-purple-400 hover:text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEdited(d => ({ ...d, icd_codes: [...(d.icd_codes || []), { code: '', description: '' }] }))}
                    className="text-xs text-purple-600 hover:text-purple-800 underline"
                  >+ Add code</button>
                </div>
              </div>

              {/* Follow-up Instructions */}
              <div>
                <label className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  Follow-Up Instructions (for patient)
                  <Badge className="bg-purple-100 text-purple-600 border-none text-[10px]">AI</Badge>
                </label>
                <textarea
                  value={edited.follow_up}
                  onChange={e => setEdited(d => ({ ...d, follow_up: e.target.value }))}
                  rows={5}
                  className="w-full text-sm rounded-lg border border-purple-200 bg-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                />
              </div>

              <Button
                size="sm"
                onClick={handleApply}
                className={`w-full rounded-full text-sm ${applied ? 'bg-green-600 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
              >
                {applied
                  ? <><CheckCircle2 className="w-4 h-4 mr-1.5" />Applied!</>
                  : <><CheckCircle2 className="w-4 h-4 mr-1.5" />Apply to Appointment</>}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}