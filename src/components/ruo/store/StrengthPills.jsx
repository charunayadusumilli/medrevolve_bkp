import React from 'react';
import { Link } from 'react-router-dom';

export default function StrengthPills({ options, currentSlug }) {
  if (!options || options.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.slug === currentSlug;
        return (
          <Link
            key={option.slug}
            to={`/ruo/p/${option.slug}`}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
              active
                ? 'border-ruo-ink bg-ruo-ink text-ruo-bg'
                : 'border-ruo-line text-ruo-muted hover:border-ruo-ink hover:text-ruo-ink'
            }`}
          >
            {option.strength_label || (option.mg ? `${option.mg} mg` : option.slug)}
          </Link>
        );
      })}
    </div>
  );
}