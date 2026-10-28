import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setState('invalid');
      return;
    }
    setState('saving');
    try {
      await base44.entities.ContactRequest.create({
        name: 'Newsletter signup',
        email,
        subject: 'Newsletter signup',
        message: 'Requested care notes and new treatment announcements.',
        source: 'website_form',
      });
      setState('done');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">
        Care notes, once a month
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="h-10 flex-1 rounded-lg border border-site-line bg-site-surface px-3 text-[13px] outline-none focus:border-site-moss"
        />
        <button
          type="submit"
          disabled={state === 'saving'}
          className="h-10 rounded-lg bg-site-moss px-4 text-[12px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
        >
          {state === 'saving' ? 'Saving' : 'Join'}
        </button>
      </div>
      {state === 'done' && <p className="mt-2 text-[12px] text-site-moss">You're on the list.</p>}
      {state === 'invalid' && <p className="mt-2 text-[12px] text-site-rust">Enter a valid email.</p>}
      {state === 'error' && <p className="mt-2 text-[12px] text-site-rust">That didn't save. Try again.</p>}
    </form>
  );
}