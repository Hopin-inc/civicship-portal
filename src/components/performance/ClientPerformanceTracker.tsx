"use client";

import { useEffect } from "react";
import { onLCP, onCLS, onINP, onTTFB } from "web-vitals";

interface ClientPerformanceTrackerProps {
  correlationId: string;
}

declare global {
  interface Window {
    __ssrHtmlFlushed?: number;
  }
}

/**
 * クライアントサイドのパフォーマンス計測コンポーネント
 * Hydration、FCP、LCP、CLSなどのCore Web Vitalsを計測してサーバーに送信
 */
export default function ClientPerformanceTracker({ correlationId }: ClientPerformanceTrackerProps) {
  useEffect(() => {
    const sendLog = (message: string, meta: Record<string, unknown>) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[ClientPerf] ${message}`, meta);
        return;
      }

      fetch("/api/client-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: "info",
          message,
          meta: {
            ...meta,
            component: "ClientPerformanceTracker",
          },
        }),
      }).catch((error) => {
        console.error("Failed to send client log:", error);
      });
    };

    const hydrationEnd = performance.now();
    const ssrHtmlFlushed = window.__ssrHtmlFlushed || 0;
    const hydrationDuration = ssrHtmlFlushed > 0 ? hydrationEnd - ssrHtmlFlushed : 0;

    sendLog("⏱️ Client Performance: Hydration", {
      correlationId,
      operation: "hydration",
      duration: `${hydrationDuration.toFixed(2)}ms`,
      durationMs: hydrationDuration,
      ssrHtmlFlushed: ssrHtmlFlushed > 0,
    });

    if (typeof window !== "undefined" && window.performance) {
      const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      
      if (navigationTiming) {
        const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
        const downloadDuration = navigationTiming.responseEnd - navigationTiming.responseStart;
        const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart;
        const loadComplete = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;

        sendLog("⏱️ Client Performance: Navigation Timing", {
          correlationId,
          operation: "navigation-timing",
          ttfb: `${ttfb.toFixed(2)}ms`,
          ttfbMs: ttfb,
          downloadDuration: `${downloadDuration.toFixed(2)}ms`,
          downloadDurationMs: downloadDuration,
          domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
          domContentLoadedMs: domContentLoaded,
          loadComplete: `${loadComplete.toFixed(2)}ms`,
          loadCompleteMs: loadComplete,
          navigationType: navigationTiming.type,
        });
      }
    }

    onLCP((metric) => {
      sendLog("⏱️ Client Performance: LCP", {
        correlationId,
        operation: "lcp",
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onCLS((metric) => {
      sendLog("⏱️ Client Performance: CLS", {
        correlationId,
        operation: "cls",
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onINP((metric) => {
      sendLog("⏱️ Client Performance: INP", {
        correlationId,
        operation: "inp",
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    onTTFB((metric) => {
      sendLog("⏱️ Client Performance: TTFB (Web Vitals)", {
        correlationId,
        operation: "ttfb-web-vitals",
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    });

    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              sendLog("⏱️ Client Performance: FCP", {
                correlationId,
                operation: "fcp",
                duration: `${entry.startTime.toFixed(2)}ms`,
                durationMs: entry.startTime,
              });
            }
          }
        });
        fcpObserver.observe({ type: "paint", buffered: true });
      } catch (error) {
        console.error("FCP PerformanceObserver error:", error);
      }
    }

    if (typeof window !== "undefined" && window.performance) {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      
      let totalJsTransfer = 0;
      let totalCssTransfer = 0;
      let slowestResource: { name: string; duration: number } | null = null;

      const jsResources: Array<{ name: string; size: number; duration: number }> = [];
      const cssResources: Array<{ name: string; size: number; duration: number }> = [];

      resources.forEach((resource) => {
        if (resource.initiatorType === "script") {
          totalJsTransfer += resource.transferSize || 0;
          jsResources.push({
            name: resource.name,
            size: resource.transferSize || 0,
            duration: resource.duration,
          });
        } else if (resource.initiatorType === "link" && resource.name.endsWith(".css")) {
          totalCssTransfer += resource.transferSize || 0;
          cssResources.push({
            name: resource.name,
            size: resource.transferSize || 0,
            duration: resource.duration,
          });
        }

        if (!slowestResource || resource.duration > slowestResource.duration) {
          slowestResource = {
            name: resource.name,
            duration: resource.duration,
          };
        }
      });

      sendLog("⏱️ Client Performance: Resource Timing", {
        correlationId,
        operation: "resource-timing",
        totalJsTransferKB: (totalJsTransfer / 1024).toFixed(2),
        totalCssTransferKB: (totalCssTransfer / 1024).toFixed(2),
        jsResourceCount: jsResources.length,
        cssResourceCount: cssResources.length,
        slowestResourceName: slowestResource?.name,
        slowestResourceDuration: slowestResource?.duration.toFixed(2),
      });
    }

    const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
    const deviceContext = {
      correlationId,
      operation: "device-context",
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || null,
      userAgent: navigator.userAgent,
    };

    sendLog("⏱️ Client Performance: Device Context", deviceContext);
  }, [correlationId]);

  return null;
}
