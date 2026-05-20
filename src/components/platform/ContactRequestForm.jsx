import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ContactRequestForm({ onSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await base44.functions.invoke('submitContactRequest', formData);
      if (response.data?.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => {
          setSuccess(false);
          if (onSuccess) onSuccess();
        }, 2500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-[#A8C99B]" />
        </div>
        <p className="text-white font-bold">Request sent successfully!</p>
        <p className="text-white/50 text-sm mt-2">We'll respond within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Your name"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#A8C99B] text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#A8C99B] text-sm"
        />
      </div>
      <input
        type="tel"
        placeholder="Phone number (optional)"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#A8C99B] text-sm"
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#A8C99B] text-sm"
      />
      <textarea
        placeholder="Message or inquiry..."
        required
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#A8C99B] text-sm h-24 resize-none"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white font-bold rounded-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </Button>
    </form>
  );
}