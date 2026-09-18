import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { DOC_LIST, generateMPA, generateServiceAgreement, generateBAA } from '@/content/merchant/merchantDocTemplates';
import {
  FileText, CheckCircle2, Loader2, ArrowLeft, Download, PenLine, ShieldCheck,
  AlertCircle, Phone, Clock
} from 'lucide-react';

const GENERATORS = { mpa: generateMPA, service_agreement: generateServiceAgreement, baa: generateBAA };
const SIGN_FIELDS = {
  mpa: { signed: 'mpa_signed', at: 'mpa_signed_at', name: 'mpa_signature_name', ip: 'mpa_signature_ip' },
  service_agreement: { signed: 'service_agreement_signed', at: 'service_agreement_signed_at', name: 'service_agreement_signature_name', ip: 'service_agreement_signature_ip' },
  baa: { signed: 'baa_signed', at: 'baa_signed_at', name: 'baa_signature_name', ip: 'baa_signature_ip' },
};

export default function MerchantDocuments() {
  const params = new URLSearchParams(window.location.search);
  const appId = params.get('app');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDoc, setActiveDoc] = useState('mpa');
  const [signing, setSigning] = useState(false);
  const [signName, setSignName] = useState('');
  const [signConsent, setSignConsent] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!appId) { setError('No application ID provided'); setLoading(false); return; }
    (async () => {
      try {
        const records = await base44.entities.MerchantApplication.filter({ id: appId });
        if (records && records.length > 0) {
          setApp(records[0]);
          setSignName(records[0].signing_officer_name || '');
        } else {
          setError('Application not found');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [appId]);

  const handleSign = async (docKey) => {
    if (!signName.trim() || !signConsent) {
      toast({ title: 'Please type your full name and check the consent box', variant: 'destructive' });
      return;
    }
    setSigning(true);
    try {
      const fields = SIGN_FIELDS[docKey];
      const updates = {
        [fields.signed]: true,
        [fields.at]: new Date().toISOString(),
        [fields.name]: signName,
        [fields.ip]: 'web-app',
      };

      // Determine new status
      const allSigned = {
        mpa: docKey === 'mpa' ? true : app.mpa_signed,
        service_agreement: docKey === 'service_agreement' ? true : app.service_agreement_signed,
        baa: docKey === 'baa' ? true : app.baa_signed,
      };
      const signedCount = Object.values(allSigned).filter(Boolean).length;
      updates.application_status = signedCount === 3 ? 'fully_signed' : 'partially_signed';

      const updated = await base44.entities.MerchantApplication.update(appId, updates);
      setApp(updated);
      setSignConsent(false);
      toast({ title: 'Document signed!', description: `${DOC_LIST.find(d => d.key === docKey).title} has been electronically signed.` });

      // Auto-advance to next unsigned doc
      const next = DOC_LIST.find(d => d.key !== docKey && !updated[SIGN_FIELDS[d.key].signed]);
      if (next) setActiveDoc(next.key);
    } catch (e) {
      toast({ title: 'Signature failed', description: e.message, variant: 'destructive' });
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = async (docKey) => {
    setDownloading(true);
    try {
      const generator = GENERATORS[docKey];
      const html = generator(app);
      const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${DOC_LIST.find(d => d.key === docKey).title}</title></head><body>${html}</body></html>`;
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docKey}_${app.legal_business_name || 'merchant'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Document downloaded', description: 'Open the HTML file and print to PDF if needed.' });
    } catch (e) {
      toast({ title: 'Download failed', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-28 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Unable to load documents</h1>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <Link to="/MerchantOnboardingIntake"><Button className="bg-[#4A6741] text-white">Start Onboarding</Button></Link>
        </div>
      </div>
    );
  }

  const signedCount = [app.mpa_signed, app.service_agreement_signed, app.baa_signed].filter(Boolean).length;
  const allSigned = signedCount === 3;
  const currentDoc = DOC_LIST.find(d => d.key === activeDoc);
  const docHtml = GENERATORS[activeDoc](app);
  const isSigned = app[SIGN_FIELDS[activeDoc].signed];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        <Link to="/" className="inline-flex items-center text-white/40 hover:text-white text-sm mb-4">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black">Onboarding Documents</h1>
            <p className="text-white/40 text-sm mt-1">{app.legal_business_name} · {app.signing_officer_email}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${allSigned ? 'bg-[#4A6741]/20 text-[#A8C99B] border border-[#4A6741]/40' : 'bg-white/5 text-white/50 border border-white/10'}`}>
            {signedCount}/3 Signed
          </div>
        </div>

        {/* All signed banner */}
        {allSigned && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#4A6741]/15 border border-[#4A6741]/40 rounded-2xl p-5 my-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#A8C99B] flex-shrink-0" />
            <div>
              <p className="font-bold text-white">All documents signed! Your onboarding is complete.</p>
              <p className="text-white/50 text-sm">A MedRevolve specialist will contact you within 24 hours to finalize your setup. Call 240-387-5224 with any questions.</p>
            </div>
          </motion.div>
        )}

        {/* Doc tabs */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {DOC_LIST.map(doc => {
            const signed = app[SIGN_FIELDS[doc.key].signed];
            const active = activeDoc === doc.key;
            return (
              <button key={doc.key} onClick={() => setActiveDoc(doc.key)}
                className={`text-left p-4 rounded-2xl border transition-all ${active ? 'bg-white/[0.06] border-white/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}>
                <div className="flex items-start justify-between mb-2">
                  <FileText className={`w-5 h-5 ${active ? 'text-[#A8C99B]' : 'text-white/30'}`} />
                  {signed ? <CheckCircle2 className="w-5 h-5 text-[#A8C99B]" /> : <div className="w-5 h-5 rounded-full border-2 border-white/20" />}
                </div>
                <p className={`font-bold text-sm ${active ? 'text-white' : 'text-white/60'}`}>{doc.title}</p>
                <p className="text-white/30 text-xs mt-1 leading-snug">{doc.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Document viewer */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Doc content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden border border-white/10">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-bold text-gray-700">{currentDoc.title}</span>
                  {isSigned && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">SIGNED</span>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDownload(activeDoc)} disabled={downloading}
                  className="text-gray-500 hover:text-gray-900 text-xs">
                  {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Download className="w-3.5 h-3.5 mr-1" /> Download</>}
                </Button>
              </div>
              <div className="max-h-[600px] overflow-y-auto p-1 bg-white">
                <div dangerouslySetInnerHTML={{ __html: docHtml }} />
              </div>
            </div>
          </div>

          {/* Signature panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sticky top-28">
              <h3 className="font-bold text-white flex items-center gap-2 mb-1">
                <PenLine className="w-4 h-4 text-[#A8C99B]" /> {isSigned ? 'Signed' : 'Sign This Document'}
              </h3>
              {isSigned ? (
                <div className="mt-4 space-y-3">
                  <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-xl p-4">
                    <CheckCircle2 className="w-6 h-6 text-[#A8C99B] mx-auto mb-2" />
                    <p className="text-center text-white text-sm font-bold">Electronically Signed</p>
                    <p className="text-center text-white/40 text-xs mt-1">by {app[SIGN_FIELDS[activeDoc].name]}</p>
                    <p className="text-center text-white/30 text-xs mt-1">
                      {new Date(app[SIGN_FIELDS[activeDoc].at]).toLocaleString('en-US')}
                    </p>
                  </div>
                  <Button onClick={() => handleDownload(activeDoc)} variant="outline" className="w-full border-white/20 text-white/70">
                    <Download className="w-4 h-4 mr-1.5" /> Download Signed Copy
                  </Button>
                  {!allSigned && (
                    <p className="text-white/40 text-xs text-center pt-2">
                      {DOC_LIST.filter(d => !app[SIGN_FIELDS[d.key].signed]).length} document(s) remaining to sign.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="text-white/50 text-xs leading-relaxed">
                    Review the document above, then type your full legal name below to electronically sign.
                    Your signature is legally binding under the E-SIGN Act.
                  </p>
                  <div>
                    <Label className="text-white/60 mb-1.5 text-xs">Full Legal Name</Label>
                    <Input value={signName} onChange={e => setSignName(e.target.value)}
                      placeholder="Type your full legal name"
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <Checkbox checked={signConsent} onCheckedChange={setSignConsent} className="mt-0.5" />
                    <span className="text-white/50 text-xs leading-relaxed">
                      I have reviewed this document and consent to sign electronically. I understand this has the same legal effect as a handwritten signature.
                    </span>
                  </label>
                  <Button onClick={() => handleSign(activeDoc)} disabled={signing || !signName.trim() || !signConsent}
                    className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold">
                    {signing ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Signing...</> : <><PenLine className="w-4 h-4 mr-1.5" /> Sign Document</>}
                  </Button>
                  <div className="flex items-center gap-2 text-white/30 text-xs pt-2 border-t border-white/10">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secured by E-SIGN Act compliance
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="mt-4 bg-white/[0.02] border border-white/10 rounded-xl p-4">
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Need Help?</p>
              <a href="tel:+12403875224" className="flex items-center gap-2 text-white/60 text-sm hover:text-white">
                <Phone className="w-4 h-4 text-[#A8C99B]" /> 240-387-5224
              </a>
              <p className="text-white/30 text-xs mt-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Mon–Fri 9am–6pm ET</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}