import type { Router } from 'vue-router';
import zhCN from '@/locales/langs/zh-cn';
import { trackPageView } from '@/track';

function getChineseTitle(i18nKey?: string): string | undefined {
  if (!i18nKey || !i18nKey.startsWith('route.')) return undefined;
  return (zhCN.route as Record<string, string>)[i18nKey.replace('route.', '')];
}

export function createTrackGuard(router: Router): void {
  router.afterEach((to, from) => {
    if (to.path === from.path) return;
    
    const { i18nKey, title } = to.meta;
    
    trackPageView(
      to.path,
      getChineseTitle(i18nKey as string) || (title as string),
      {
        routeName: to.name as string,
        routeTitle: title as string,
        i18nKey: i18nKey as string,
        query: to.query,
        params: to.params
      }
    );
  });
}
