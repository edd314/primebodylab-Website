'use client';

import {useEffect, useRef, useState} from 'react';
import {Figure} from '@/components/media/Figure';
import {gallery} from '@/content/gallery';
import type {Locale} from '@/content/schema';

const SLIDE_CLASS =
  'aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[42%] lg:w-[28%]';

/** Homepage "behind the scenes" strip — swipeable photos and clips, no captions. */
export function Gallery({locale}: {locale: Locale}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(slides.indexOf(entry.target as HTMLElement));
          }
        }
      },
      {root: track, threshold: 0.6},
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  if (gallery.length === 0) return null;

  return (
    <section className="border-b border-line py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-sage">
          {locale === 'de' ? 'Einblicke' : 'A Look Inside'}
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {gallery.map((item, index) => (
          <Figure
            key={index}
            image={item}
            locale={locale}
            data-testid="gallery-slide"
            className={SLIDE_CLASS}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 78vw"
            priority={false}
          />
        ))}
      </div>

      {gallery.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {gallery.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === active ? 'bg-sage' : 'bg-line'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
