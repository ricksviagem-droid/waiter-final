import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Apply locale routing to Brazil Abroad pages only
    // Excludes waiter AI standalone modules and Next.js internals
    '/((?!interview|shift|level-scan|daily-drill|training|resume|menu-master|pos|work-abroad|preview|api|_next|_vercel|.*\\..*).*)',
  ],
};
