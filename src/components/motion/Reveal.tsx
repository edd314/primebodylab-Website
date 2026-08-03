'use client';

import {useEffect, useRef, useState} from 'react';

/**
 * Fades and rises children into place the first time they scroll into view.
 * `delay` (ms) staggers siblings so a row of cards doesn't land all at once.
 * Respects prefers-reduced-motion via Tailwind's motion-reduce: variant.
 */
type Props = {delay?: number} & React.ComponentPropsWithoutRef<'div'>;

export function Reveal({children, delay = 0, className = '', ...rest}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0.2},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{transitionDelay: `${delay}ms`}}
      {...rest}
    >
      {children}
    </div>
  );
}
