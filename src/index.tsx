import ResizeObserverPolyfill from 'resize-observer-polyfill';

window.global = window;

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = ResizeObserverPolyfill;
}

import('@libs/vite-polyfills/polyfills').then(() => import('./main'));
