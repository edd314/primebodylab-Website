import {setRequestLocale} from 'next-intl/server';

type Props = {params: Promise<{locale: string}>};

export default async function ServicesPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <h1 className="font-display text-5xl">
      {locale === 'de' ? 'Leistungen' : 'Services'}
    </h1>
  );
}
