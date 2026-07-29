import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /**
   * Legacy Squarespace URLs. These preserve whatever ranking and inbound links
   * the old site earned — deleting them instead would throw that away.
   *
   * /services deliberately has no entry: next-intl already serves it as the
   * English services route (/leistungen is the German one).
   */
  async redirects() {
    return [
      {source: '/appointments', destination: '/buchen', permanent: true},
      {source: '/faqs-2', destination: '/faq', permanent: true},
      {
        source: '/terms-conditions-and-privacy-policy',
        destination: '/datenschutz',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
