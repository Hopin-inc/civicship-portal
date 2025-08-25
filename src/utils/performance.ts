export const measureWebVitals = () => {
  // ブラウザ環境でのみ実行
  if (typeof window === 'undefined') return;

  try {
    // 基本的なパフォーマンス測定
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      console.log('[PERFORMANCE] TTFB:', navigation.responseStart - navigation.requestStart, 'ms');
      console.log('[PERFORMANCE] DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
      console.log('[PERFORMANCE] Load Complete:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
    }

    // 現在の時間を記録
    console.log('[PERFORMANCE] Current Time:', performance.now(), 'ms');
    
  } catch (error) {
    console.warn('[PERFORMANCE] Performance measurement failed:', error);
  }
};

export const logPerformanceMetrics = (metric: any) => {
  console.log(`[PERFORMANCE] ${metric.name}: ${metric.value}${metric.unit || ''}`);
  
  // パフォーマンスが悪い場合の警告
  if (metric.name === 'LCP' && metric.value > 2500) {
    console.warn('[PERFORMANCE] LCP is too slow (>2.5s)');
  }
  if (metric.name === 'FID' && metric.value > 100) {
    console.warn('[PERFORMANCE] FID is too slow (>100ms)');
  }
  if (metric.name === 'CLS' && metric.value > 0.1) {
    console.warn('[PERFORMANCE] CLS is too high (>0.1)');
  }
};
