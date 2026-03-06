import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import PhoneInput from '@/components/ui/PhoneInput';
import { User, Mail, Phone, CheckCircle2, AlertCircle, Loader2, Shield, Lock } from 'lucide-react';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
  });

  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm({
        full_name: u?.full_name || '',
        phone: u?.phone || '',
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      base44.auth.redirectToLogin(window.location.href);
    });
  }, []);

  const validatePhone = (phone) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return 'Please enter a valid phone number with at least 10 digits';
    return '';
  };

  const handleSave = async () => {
    const pErr = validatePhone(form.phone);
    if (pErr) { setPhoneError(pErr); return; }
    setPhoneError('');
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await base44.auth.updateMe({ full_name: form.full_name, phone: form.phone });
      // Refresh user and sync form state
      const updated = await base44.auth.me();
      setUser(updated);
      setForm({
        full_name: updated.full_name || '',
        phone: updated.phone || '',
      });
      setSuccess('Profile updated successfully.');
    } catch (e) {
      setError(e?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A6741]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2D3A2D]">Account Settings</h1>
            <p className="text-[#5A6B5A] mt-1">Manage your profile and contact information.</p>
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E0D5] space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#E8E0D5]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D3A2D] to-[#4A6741] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user.full_name?.[0] || user.email?.[0] || 'U'}
              </div>
              <div>
                <p className="font-semibold text-[#2D3A2D] text-lg">{user.full_name || 'No name set'}</p>
                <p className="text-sm text-[#5A6B5A]">{user.email}</p>
                <Badge className="mt-1 bg-[#4A6741]/10 text-[#4A6741] border-none text-xs capitalize">
                  {user.role || 'user'}
                </Badge>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <Label className="text-sm font-semibold text-[#2D3A2D] mb-2 block">
                Full Name
              </Label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#9A8B7A] flex-shrink-0" />
                <Input
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value.slice(0, 100) }))}
                  placeholder="Your full name"
                  className="rounded-xl border-[#E8E0D5] focus-visible:ring-[#4A6741]"
                />
              </div>
            </div>

            {/* Email — read-only with note */}
            <div>
              <Label className="text-sm font-semibold text-[#2D3A2D] mb-2 block">
                Email Address
              </Label>
              <div className="flex items-center gap-2 p-3 bg-[#F5F0E8] rounded-xl border border-[#E8E0D5]">
                <Mail className="w-4 h-4 text-[#9A8B7A] flex-shrink-0" />
                <span className="text-sm text-[#2D3A2D] flex-1 break-all">{user.email}</span>
                <Lock className="w-3.5 h-3.5 text-[#9A8B7A] flex-shrink-0" />
              </div>
              <p className="text-xs text-[#9A8B7A] mt-1.5 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Email is managed by your login provider and cannot be changed here. Contact support if you need to update it.
              </p>
            </div>

            {/* Phone */}
            <div>
              <Label className="text-sm font-semibold text-[#2D3A2D] mb-2 block">
                Phone Number <span className="text-[#9A8B7A] font-normal">(optional)</span>
              </Label>
              <PhoneInput
                value={form.phone}
                onChange={v => { setForm(f => ({ ...f, phone: v })); setPhoneError(''); }}
                error={phoneError}
              />
              {phoneError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {phoneError}
                </p>
              )}
              <p className="text-xs text-[#9A8B7A] mt-1.5">Used for appointment reminders via SMS.</p>
            </div>

            {/* Feedback */}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-800 text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {/* Save */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full py-6 font-semibold"
            >
              {saving ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </div>

          {/* Security section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E0D5] mt-6">
            <h2 className="text-lg font-semibold text-[#2D3A2D] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#4A6741]" /> Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-[#F5F0E8] rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#4A6741] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#2D3A2D] text-sm">Account Verified</p>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">Your account is secured via email authentication. Password and authentication settings are managed through your login provider.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#F5F0E8] rounded-xl">
                <Mail className="w-5 h-5 text-[#4A6741] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#2D3A2D] text-sm">Email Notifications</p>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">Appointment confirmations, reminders, and care updates are sent to <strong>{user.email}</strong>.</p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 rounded-full border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => base44.auth.logout('/')}
            >
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}