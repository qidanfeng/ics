export enum TrackEventType {
  PAGE_VIEW = 'page_view',
  BUTTON_CLICK = 'button_click'
}

export interface PageViewData {
  platform: 'MDM';
  path: string;
  title?: string;
  referrer?: string;
  timestamp: number;
  userId?: number;
  extra?: Record<string, unknown>;
}

export interface ButtonClickData {
  platform: 'MDM';
  name: string;
  description?: string;
  path: string;
  timestamp: number;
  userId?: number;
  extra?: Record<string, unknown>;
}

export type TrackData = PageViewData | ButtonClickData;

export interface TrackConfig {
  enabled: boolean;
  reportInterval?: number;
  batchSize?: number;
}

export type TrackDirectiveValue = string | {
  name: string;
  description?: string;
  extra?: Record<string, unknown>;
};
