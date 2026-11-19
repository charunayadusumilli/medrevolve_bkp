import React from 'react';

/** Square static creative for paid traffic landings — image, headline, small CTA. */
export default function StaticCreative({ slot }) {
  const body = (
    <>
      {slot.poster_url ? (
        <img
          src={slot.poster_url}
          alt={slot.headline || slot.caption || 'Research supply'}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-ruo-ink font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-bg/60">
          Creative pending
        </div>
      )}
      <div className="p-4">
        {slot.headline && (
          <p className="text-[13px] font-semibold leading-snug text-ruo-ink">{slot.headline}</p>
        )}
        {slot.cta_label && (
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-accent">
            {slot.cta_label}
          </p>
        )}
      </div>
    </>
  );

  const shell = 'block h-full border border-ruo-line bg-ruo-surface';

  if (!slot.destination_url) {
    return <article className={shell}>{body}</article>;
  }

  return (
    <a href={slot.destination_url} className={shell}>
      {body}
    </a>
  );
}