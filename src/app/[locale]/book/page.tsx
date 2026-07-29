import {setRequestLocale} from 'next-intl/server';

type Props = {params: Promise<{locale: string}>};

export default async function BookPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <h1 className="font-display text-4xl">
      {locale === 'de' ? 'Termin buchen' : 'Book an appointment'}
    </h1>
  );
}
