'use client';

import Image from 'next/image';
import {useState} from 'react';
import type {Locale, VideoIntro as VideoIntroContent} from '@/content/schema';

export function VideoIntro({locale, video}: {locale: Locale; video: VideoIntroContent}) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="border-b border-line py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-sage">{video.eyebrow[locale]}</h2>
        <h3 className="mt-2 font-display text-2xl leading-snug text-balance">{video.heading[locale]}</h3>
        <p className="mt-2 text-sm text-muted">{video.body[locale]}</p>

        <div className="relative mt-7 aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl bg-surface">
          {playing ? (
            <video
              src={video.src}
              poster={video.poster}
              aria-label={video.alt[locale]}
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={video.playLabel[locale]}
              className="group relative block h-full w-full"
            >
              <Image
                src={video.poster}
                alt={video.alt[locale]}
                fill
                sizes="(min-width: 640px) 24rem, 100vw"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bone/90">
                  <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-ink">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
