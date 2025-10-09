'use client';

import { useEffect } from 'react';
import { polyfillRequestIdleCallback } from '@/lib/polyfills';

export default function ClientPolyfills() {
  useEffect(() => {
    polyfillRequestIdleCallback();
  }, []);

  return null;
}
