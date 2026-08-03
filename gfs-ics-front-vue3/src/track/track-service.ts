import { useAuthStore } from '@/store/modules/auth';
import type { PageViewData, ButtonClickData, TrackConfig } from './types';
import { $t } from '@/locales';
import { request } from '@/service/request';

export function saveTrackPage(params: Record<string, any>) {
  return request({
    url: '/system/sysTrackPageView/save',
    method: 'post',
    data: params,
  });
}

export function batchSavePageAndButton(params: Record<string, any>) {
  return request({
    url: '/system/sysTrackPageView/batchSavePageAndButton',
    method: 'post',
    data: params,
  });
}

export function saveTrackButton(params: Record<string, any>) {
  return request({
    url: '/system/sysTrackButtonClick/save',
    method: 'post',
    data: params,
  });
}

const DEFAULT_CONFIG: TrackConfig = {
  enabled: true,
  reportInterval: 5000,
  batchSize: 10
};

class TrackService {
  private config: TrackConfig;
  private pageViews: PageViewData[] = [];
  private buttonClicks: ButtonClickData[] = [];
  private reportTimer: ReturnType<typeof setInterval> | null = null;
  private currentPath: string = '';

  constructor(config: Partial<TrackConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (this.config.enabled) {
      this.startBatchReport();
    }
  }

  private getUserId(): number | undefined {
    const authStore = useAuthStore();
    return authStore.userInfo.userId ? Number(authStore.userInfo.userId) : undefined;
  }

  private startBatchReport(): void {
    if (this.reportTimer) return;

    this.reportTimer = setInterval(() => {
      this.flush();
    }, this.config.reportInterval);
  }

  private stopBatchReport(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }

  async flush(): Promise<void> {
    const pageViews = [...this.pageViews];
    const buttonClicks = [...this.buttonClicks];

    this.pageViews = [];
    this.buttonClicks = [];

    if (pageViews.length === 0 && buttonClicks.length === 0) return;

    try {
      if (pageViews.length === 1 && buttonClicks.length === 0) {
        await saveTrackPage(pageViews[0]);
      } else if (buttonClicks.length === 1 && pageViews.length === 0) {
        await saveTrackButton(buttonClicks[0])
      } else {
        await batchSavePageAndButton({ pageViews, buttonClicks });
      }
    } catch (error) {
      console.error('[Track] Report failed:', error);
      this.pageViews.unshift(...pageViews);
      this.buttonClicks.unshift(...buttonClicks);
    }
  }

  private checkAndFlush(): void {
    const totalCount = this.pageViews.length + this.buttonClicks.length;
    if (totalCount >= (this.config.batchSize || 10)) {
      this.flush();
    }
  }

  trackPageView(path: string, title?: string, extra?: Record<string, unknown>): void {
    if (!this.config.enabled) return;

    const data: PageViewData = {
      path,
      title: title || document.title,
      referrer: this.currentPath || document.referrer,
      timestamp: Date.now(),
      userId: this.getUserId(),
      platform: 'ICS'
    };

    this.currentPath = path;
    this.pageViews.push(data);
    this.checkAndFlush();
  }

  trackButtonClick(name: string, description?: string, extra?: Record<string, unknown>): void {
    if (!this.config.enabled) return;

    const data: ButtonClickData = {
      name,
      description,
      path: this.currentPath || window.location.pathname,
      timestamp: Date.now(),
      userId: this.getUserId(),
      platform: 'ICS'
    };

    this.buttonClicks.push(data);
    this.checkAndFlush();
  }

  updateConfig(config: Partial<TrackConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.config.enabled) {
      this.startBatchReport();
    } else {
      this.stopBatchReport();
    }
  }

  destroy(): void {
    this.stopBatchReport();
    this.flush();
  }
}

export const trackService = new TrackService();

export const trackPageView = trackService.trackPageView.bind(trackService);

export const trackButtonClick = trackService.trackButtonClick.bind(trackService);
