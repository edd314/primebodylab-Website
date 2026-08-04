import Image from 'next/image';
import type {Locale, SiteImage} from '@/content/schema';

type Props = {
  image: SiteImage;
  locale: Locale;
  /** Tailwind classes for the frame — must establish a size. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  'data-testid'?: string;
};

/**
 * Renders a photograph inside a sized frame. When the image is still stock
 * (`placeholder: true`) it also renders a small chip, so Eddie can see exactly
 * where his photos will land and no visitor mistakes stock for his studio.
 */
export function Figure({
  image,
  locale,
  className = '',
  sizes = '100vw',
  priority,
  'data-testid': testId,
}: Props) {
  return (
    <div data-testid={testId} className={`relative overflow-hidden bg-line ${className}`}>
      <Image
        src={image.src}
        alt={image.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{objectPosition: image.focus}}
      />

      {image.placeholder && (
        <span className="absolute bottom-3 left-3 rounded-full bg-bone/90 px-3 py-1 text-[11px] tracking-wide text-muted uppercase backdrop-blur-sm">
          {locale === 'de' ? 'Platzhalter' : 'Placeholder'}
        </span>
      )}
    </div>
  );
}
