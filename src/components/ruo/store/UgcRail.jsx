import React, { useEffect, useState } from 'react';
import StaticCreative from './StaticCreative';
import { loadSlots } from '@/lib/ruo/ugc';

function VideoTile({ slot }) {
  const frame = (
    <>
      {slot.video_url ? (
        <video
          src={slot.video_url}
          poster={slot.poster_url || undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : slot.poster_url ? (
        <img
          src={slot.poster_url}
          alt={slot.caption || 'Research supply clip'}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-ruo-ink font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-bg/50">
          Clip pending
        </div>
      )}

      {slot.duration_seconds > 0 && (
        <span className="absolute bottom-2 right-2 border border-ruo-bg/40 bg-ruo-ink/80 px-1.5 py-0.5 font-mono text-[9px] tabular-nums text-ruo-bg">
          {Math.floor(slot.duration_seconds / 60)}:{String(slot.duration_seconds % 60).padStart(2, '0')}
        </span>
      )}
    </>
  );

  const shell = 'relative block aspect-[9/16] overflow-hidden bg-ruo-ink';

  return (
    <figure className="shrink-0 snap-start">
      {slot.destination_url ? (
        <a href={slot.destination_url} className={shell}>{frame}</a>
      ) : (
        <div className={shell}>{frame}</div>
      )}
      {slot.caption && (
        <figcaption className="mt-2 max-w-[190px] text-[10px] leading-snug text-ruo-muted">
          {slot.caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Slot-driven UGC rail. Creatives are swapped in the admin registry by slot id —
 * no code change. Renders nothing until at least one active slot exists.
 */
export default function UgcRail({ surface, variant = 'rail', title }) {
  const [slots, setSlots] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadSlots(surface)
      .then((items) => { if (!cancelled) setSlots(items); })
      .catch(() => { if (!cancelled) setSlots([]); });
    return () => { cancelled = true; };
  }, [surface]);

  if (!slots || slots.length === 0) return null;

  const strip = variant === 'strip';

  return (
    <section className={strip ? 'border-y border-ruo-line py-5' : 'mt-12'}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-muted">
          {title || (strip ? 'From the lab feed' : 'Research feed')}
        </h2>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ruo-muted">
          Swipe
        </span>
      </div>

      <div
        className={`mt-4 flex gap-3 overflow-x-auto pb-2 ${
          strip ? 'snap-x snap-mandatory' : 'snap-x snap-mandatory'
        }`}
      >
        {slots.map((slot) =>
          slot.variant === 'creative' ? (
            <div key={slot.slot_id} className="w-[190px] shrink-0 snap-start">
              <StaticCreative slot={slot} />
            </div>
          ) : (
            <div key={slot.slot_id} className={strip ? 'w-[130px] shrink-0' : 'w-[170px] shrink-0'}>
              <VideoTile slot={slot} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}