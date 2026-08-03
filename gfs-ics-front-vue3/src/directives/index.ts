import type { App } from 'vue';
import { setupTrackDirective } from './track';

export function setupDirectives(app: App): void {
  setupTrackDirective(app);
}

export { trackDirective } from './track';
