import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const method = 'font-mono';

function Field({ label, value }) {
  return (
    <div className="border-b border-ruo-line py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-muted">{label}</p>
      <p className={`mt-1 text-[13px] ${method}`}>{value || '—'}</p>
    </div>
  );
}

export default function RuoVerifyPage() {
  const [params, setParams] = useSearchParams();
  const [lot, setLot] = useState(params.get('lot') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = useCallback(async (code) => {
    const value = String(code || '').trim();
    if (!value) {
      setError('Enter the lot number printed on the vial label.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await base44.functions.invoke('ruoVerifyLot', { lot: value });
      const data = res?.data || {};
      if (data.ok && data.verified && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Lot not found. Check the number printed under the QR code on the vial label.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Lot verification is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = params.get('lot');
    if (initial) verify(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setParams(lot.trim() ? { lot: lot.trim() } : {});
    verify(lot);
  };

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Lot verification</p>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">Verify a lot</h1>
      <p className="mt-3 text-[12px] leading-relaxed text-ruo-muted">
        Enter the lot number printed on the vial label. The result is returned live by the independent
        laboratory that tested the lot.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          placeholder="MRV-BPC-2601"
          className="h-11 flex-1 border border-ruo-ink bg-ruo-surface px-3 font-mono text-[13px] uppercase tracking-[0.06em] outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 bg-ruo-ink px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-bg disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Verify lot'}
        </button>
      </form>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ruo-muted">
        Scan QR instead — vial labels carry a QR code that opens this page with the lot already filled in.
      </p>

      {error && (
        <div className="mt-8 border border-ruo-warn p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-warn">Not verified</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ruo-ink">{error}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-ruo-muted">
            If the label is legible and this persists, email support@medrevolveruo.com with the lot number
            and a photo of the label.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 border border-ruo-ink bg-ruo-surface">
          <div className="flex items-center justify-between border-b border-ruo-ink px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-accent">
              Verified · third-party laboratory
            </p>
            <p className="font-mono text-[10px] text-ruo-muted">{result.status || 'released'}</p>
          </div>

          <div className="grid gap-x-8 px-5 py-2 sm:grid-cols-2">
            <Field label="Product" value={result.product} />
            <Field label="Fill" value={result.strength_mg ? `${result.strength_mg} mg` : ''} />
            <Field label="Purity" value={result.purity_pct != null ? `${result.purity_pct}%` : ''} />
            <Field label="Test method" value={result.test_method} />
            <Field label="Laboratory" value={result.lab_name} />
            <Field label="Accreditation" value={result.lab_accreditation} />
            <Field label="Manufactured" value={result.manufactured_on} />
            <Field label="Retest by" value={result.retest_on} />
            <Field label="Lot" value={result.lot} />
            <Field label="Form" value={result.form} />
          </div>

          {result.report_url && (
            <div className="border-t border-ruo-line px-5 py-4">
              <a
                href={result.report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-ruo-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-bg"
              >
                Open the lab's report
              </a>
              <p className="mt-3 text-[10px] leading-relaxed text-ruo-muted">
                Reports are hosted by the testing laboratory, not published by us.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}