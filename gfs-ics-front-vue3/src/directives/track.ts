import type { Directive, DirectiveBinding } from 'vue';
import { trackButtonClick } from '@/track';
import type { TrackDirectiveValue } from '@/track/types';

export const trackDirective: Directive<HTMLElement, TrackDirectiveValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<TrackDirectiveValue>) {
    const handleClick = () => {
      const value = binding.value;
      
      if (typeof value === 'string') {
        trackButtonClick(value);
      } else if (value && typeof value === 'object') {
        trackButtonClick(value.name, value.description, value.extra);
      }
    };

    (el as any)._trackClickHandler = handleClick;
    el.addEventListener('click', handleClick);
  },
  
  unmounted(el: HTMLElement) {
    const handleClick = (el as any)._trackClickHandler;
    if (handleClick) {
      el.removeEventListener('click', handleClick);
      delete (el as any)._trackClickHandler;
    }
  }
};

export function setupTrackDirective(app: import('vue').App): void {
  app.directive('track', trackDirective);
}
