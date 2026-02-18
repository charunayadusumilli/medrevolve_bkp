import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Send, Users, Plus, Trash2, CheckCircle2,
  Stethoscope, Upload, Download, Eye, Loader2, X
} from 'lucide-react';

const DEFAULT_SUBJECT = 'Join the MedRevolve Provider Network — Earn More, See More Patients';

const DEFAULT_BODY = `Dear Dr. [Name],

We're reaching out to invite you to join MedRevolve — a fast-growing telehealth platform connecting licensed providers with patients across the country seeking personalized wellness care.

Why join MedRevolve?
• Flexible telehealth schedule — set your own hours
• Competitive per-consultation compensation
• No administrative overhead — we handle billing, scheduling & compliance
• Access to a large patient base seeking weight loss, hormone, longevity & peptide therapies
• Full clinical autonomy — you make the medical decisions

We're currently onboarding providers specializing in:
• Weight Management / Obesity Medicine
• Internal Medicine / Family Medicine
• Endocrinology & Hormone Therapy
• Anti-Aging & Longevity Medicine

Getting started is simple:
1. Complete our 4-step online application (takes ~10 minutes)
2. Submit your license and credentials for verification
3. Complete a brief orientation with our medical director
4. Start seeing patients within 7-10 business days

👉 Apply here: https://app.medrevolve.com/ProviderIntake

Questions? Reply to this email or reach us at providers@medrevolve.com

We look forward to welcoming you to the network.

Warm regards,
The MedRevolve Provider Relations Team`;

export default function ProviderOutreach() {
  const queryClient = useQueryClient();
  const [recipients, setRecipients] = useState([{ name: '', email: '', specialty: '' }]);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [preview, setPreview] = useState(false);
  const [sent, setSent] = useState([]);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);

  const { data: intakes } = useQuery({
    queryKey: ['provider-intakes'],
    queryFn: () => base44.entities.ProviderIntake.list('-created_date', 50),
    initialData: []
  });

  const addRecipient = () => setRecipients([...recipients, { name: '', email: '', specialty: '' }]);
  const removeRecipient = (i) => setRecipients(recipients.filter((_, idx) => idx !== i));
  const updateRecipient = (i, field, value) => {
    const updated = [...recipients];
    updated[i] = { ...updated[i], [field]: value };
    setRecipients(updated);
  };

  const parseBulk = () => {
    const lines = bulkInput.trim().split('\n').filter(Boolean);
    const parsed = lines.map(line => {
      const parts = line.split(',').map(s => s.trim());
      return { name: parts[0] || '', email: parts[1] || '', specialty: parts[2] || '' };
    }).filter(r => r.email.includes('@'));
    if (parsed.length) {
      setRecipients([...recipients.filter(r => r.email), ...parsed]);
      setBulkInput('');
      setShowBulkInput(false);
    }
  };

  const validRecipients = recipients.filter(r => r.email && r.email.includes('@'));

  const handleSend = async () => {
    if (!validRecipients.length) return;
    setSending(true);
    try {
      const { data } = await base44.functions.invoke('sendProviderOutreach', {
        recipients: validRecipients,
        subject,
        body
      });
      setResults(data);
      setSent(validRecipients.map(r => r.email));
    } catch (e) {
      setResults({ error: e.message });
    } finally {
      setSending(false);
    }
  };

  const pendingIntakes = intakes.filter(i => i.status === 'pending');

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2D3A2D]">Provider Recruitment Campaign</h1>
          <p className="text-[#5A6B5A] mt-1">Send personalized outreach emails to eligible providers with your signup package</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Recipients Added', value: validRecipients.length, color: 'text-blue-600' },
            { label: 'Emails Sent', value: sent.length, color: 'text-green-600' },
            { label: 'Pending Applications', value: pendingIntakes.length, color: 'text-amber-600' },
            { label: 'Total Applicants', value: intakes.length, color: 'text-purple-600' },
          ].map(s => (
            <Card key={s.label} className="border-[#E8E0D5]">
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-[#5A6B5A] mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Recipients */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-[#E8E0D5]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4A6741]" /> Recipients
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowBulkInput(!showBulkInput)} className="text-xs">
                      <Upload className="w-3 h-3 mr-1" /> Bulk
                    </Button>
                    <Button size="sm" variant="outline" onClick={addRecipient} className="text-xs">
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {showBulkInput && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                        <p className="text-xs text-blue-700 mb-2 font-medium">Paste CSV: Name, Email, Specialty (one per line)</p>
                        <Textarea
                          value={bulkInput}
                          onChange={e => setBulkInput(e.target.value)}
                          placeholder="Dr. Jane Smith, jane@clinic.com, Family Medicine&#10;Dr. John Doe, john@hospital.com, Endocrinology"
                          className="text-xs min-h-[80px] mb-2"
                        />
                        <Button size="sm" onClick={parseBulk} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                          Import
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {recipients.map((r, i) => (
                    <div key={i} className="bg-[#F5F0E8] rounded-xl p-3 space-y-2 relative group">
                      <button onClick={() => removeRecipient(i)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <Input
                        placeholder="Dr. Full Name"
                        value={r.name}
                        onChange={e => updateRecipient(i, 'name', e.target.value)}
                        className="h-8 text-sm bg-white"
                      />
                      <Input
                        placeholder="email@clinic.com"
                        value={r.email}
                        onChange={e => updateRecipient(i, 'email', e.target.value)}
                        className="h-8 text-sm bg-white"
                      />
                      <Input
                        placeholder="Specialty (optional)"
                        value={r.specialty}
                        onChange={e => updateRecipient(i, 'specialty', e.target.value)}
                        className="h-8 text-sm bg-white"
                      />
                      {sent.includes(r.email) && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="w-3 h-3" /> Sent
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#5A6B5A]">{validRecipients.length} valid recipient{validRecipients.length !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            {intakes.length > 0 && (
              <Card className="border-[#E8E0D5]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#4A6741]" /> Recent Applicants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {intakes.slice(0, 8).map(intake => (
                      <div key={intake.id} className="flex items-center justify-between py-1.5 border-b border-[#E8E0D5] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-[#2D3A2D]">{intake.full_name}</p>
                          <p className="text-xs text-[#5A6B5A]">{intake.specialty} · {intake.title}</p>
                        </div>
                        <Badge className={
                          intake.status === 'approved' ? 'bg-green-100 text-green-700 border-none' :
                          intake.status === 'rejected' ? 'bg-red-100 text-red-700 border-none' :
                          'bg-amber-100 text-amber-700 border-none'
                        }>
                          {intake.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Email Composer */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-[#E8E0D5]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#4A6741]" /> Email Campaign
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setPreview(!preview)} className="text-xs">
                    <Eye className="w-3 h-3 mr-1" /> {preview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">Subject Line</Label>
                  <Input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="mt-1.5"
                    disabled={preview}
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-[#5A6B5A] uppercase tracking-wider">
                    Email Body <span className="normal-case font-normal text-[#5A6B5A]">— use [Name] for personalization</span>
                  </Label>
                  {preview ? (
                    <div className="mt-1.5 rounded-xl border border-[#E8E0D5] p-4 bg-white text-sm text-[#2D3A2D] whitespace-pre-wrap min-h-[340px] font-mono leading-relaxed text-xs">
                      {body.replace('[Name]', validRecipients[0]?.name?.replace(/^Dr\.\s*/i, '') || 'Provider')}
                    </div>
                  ) : (
                    <Textarea
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      className="mt-1.5 min-h-[340px] font-mono text-xs leading-relaxed"
                    />
                  )}
                </div>

                <div className="bg-[#F5F0E8] rounded-xl p-4 text-sm text-[#5A6B5A]">
                  <p className="font-semibold text-[#2D3A2D] mb-1 text-xs uppercase tracking-wider">What's included in the outreach</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" /> Personalized greeting with provider name</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" /> Platform benefits & compensation overview</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" /> Direct link to 4-step application</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741] flex-shrink-0" /> Onboarding timeline & next steps</li>
                  </ul>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={sending || validRecipients.length === 0}
                  className="w-full bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full h-12 text-base font-semibold"
                >
                  {sending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending to {validRecipients.length} provider{validRecipients.length !== 1 ? 's' : ''}...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Send Campaign to {validRecipients.length} Provider{validRecipients.length !== 1 ? 's' : ''}</>
                  )}
                </Button>

                {results && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 text-sm ${results.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {results.error ? (
                      <p>Error: {results.error}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Campaign sent successfully!</p>
                          <p className="text-xs mt-0.5">{results.sent} email{results.sent !== 1 ? 's' : ''} delivered · {results.failed || 0} failed</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}