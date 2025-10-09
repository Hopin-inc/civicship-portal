'use client';

import { polyfillRequestIdleCallback } from '@/lib/polyfills';

polyfillRequestIdleCallback();

export default function ClientPolyfills() {
  return null;
}
