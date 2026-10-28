import React from 'react';
import { Play } from 'lucide-react';

const POSTER =
  'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/de750191a_generated_image.png';

const VIDEOS = [
  { title: 'Platform tour in 4 minutes', length: '4:12' },
  { title: 'How the clinical network works', length: '6:38' },
  { title: 'Inside a launch week', length: '8:05' },
];

export default function VideoGrid() {
  return (
    <section id="videos" className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Videos</p>
        <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
          Watch the walkthrough
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {VIDEOS.map((video) => (
            <a
              key={video.title}
              href="https://www.youtube.com/@medrevolve"
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-site-line bg-site-cream"
            >
              <div className="relative overflow-hidden">
                <img
                  src={POSTER}
                  alt=""
                  className="aspect-[16/9] w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-site-moss/90 text-site-cream">
                    <Play className="h-4 w-4" />
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-[13px] font-semibold">{video.title}</p>
                <span className="text-[11px] text-site-greige">{video.length}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}