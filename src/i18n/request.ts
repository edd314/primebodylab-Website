import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

/**
 * `messages` is intentionally empty. All copy lives in typed files under
 * src/content/ so the owner edits data, not translation catalogues.
 * next-intl is used here for routing and locale resolution only.
 */
export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {locale, messages: {}};
});
