import React from 'react';
import { Instagram, Youtube, Linkedin, Music2 } from 'lucide-react';

const PROFILES = [
  { label: 'Instagram', href: 'https://www.instagram.com/medrevolve', Icon: Instagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@medrevolve', Icon: Music2 },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/medrevolve', Icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/@medrevolve', Icon: Youtube },
];

export default function SocialRow({ tone = 'light' }) {
  const base = tone === 'dark' ? 'border-white/20 text-white/70 hover:text-white' : 'border-site-line text-site-greige hover:text-site-moss';

  return (
    <div className="flex items-center gap-2">
      {PROFILES.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`grid h-9 w-9 place-items-center rounded-full border transition-colors duration-200 ${base}`}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}