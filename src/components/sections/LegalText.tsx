export function LegalText({heading, body}: {heading: string; body: string}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-20">
      <h1 className="font-display text-4xl sm:text-5xl">{heading}</h1>

      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted">
        {body.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
