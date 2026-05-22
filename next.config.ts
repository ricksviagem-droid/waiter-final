import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const WA_REDIRECT = 'https://wa.me/5511962794747?text=Ol%C3%A1%20Ricardo%2C%20assisti%20ao%20v%C3%ADdeo%20e%20quero%20saber%20mais%20sobre%20a%20consultoria.';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/assessment', destination: WA_REDIRECT, permanent: false },
      { source: '/:locale/assessment', destination: WA_REDIRECT, permanent: false },
      { source: '/assessment/result', destination: WA_REDIRECT, permanent: false },
      { source: '/:locale/assessment/result', destination: WA_REDIRECT, permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
