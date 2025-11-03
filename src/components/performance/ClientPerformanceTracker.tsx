"use client";

import { useEffect } from "react";

interface ClientPerformanceTrackerProps {
  correlationId: string;
}

/**
 * クライアントサイドのパフォーマンス計測コンポーネント
 * Hydration、FCP、LCP、CLSなどのCore Web Vitalsを計測してサーバーに送信
 */
export default function ClientPerformanceTracker({ correlationId }: ClientPerformanceTrackerProps) {
  useEffect(() => {
    const hydrationStart = performance.now();

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
    const hydrationDuration = hydrationEnd - hydrationStart;

    sendLog("⏱️ Client Performance: Hydration", {
      correlationId,
      operation: "hydration",
      duration: `${hydrationDuration.toFixed(2)}ms`,
      durationMs: hydrationDuration,
    });

    if (typeof window !== "undefined" && window.performance) {
      const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      
      if (navigationTiming) {
        const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
        const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart;
        const loadComplete = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;

        sendLog("⏱️ Client Performance: Navigation Timing", {
          correlationId,
          operation: "navigation-timing",
          ttfb: `${ttfb.toFixed(2)}ms`,
          ttfbMs: ttfb,
          domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
          domContentLoadedMs: domContentLoaded,
          loadComplete: `${loadComplete.toFixed(2)}ms`,
          loadCompleteMs: loadComplete,
        });
      }
    }

    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              sendLog("⏱️ Client Performance: First Contentful Paint", {
                correlationId,
                operation: "fcp",
                duration: `${entry.startTime.toFixed(2)}ms`,
                durationMs: entry.startTime,
              });
            }
          }
        });
        fcpObserver.observe({ type: "paint", buffered: true });

        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            sendLog("⏱️ Client Performance: Largest Contentful Paint", {
              correlationId,
              operation: "lcp",
              duration: `${lastEntry.startTime.toFixed(2)}ms`,
              durationMs: lastEntry.startTime,
            });
          }
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
              clsValue += (entry as PerformanceEntry & { value: number }).value;
            }
          }
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });

        const sendCLS = () => {
          if (clsValue > 0) {
            sendLog("⏱️ Client Performance: Cumulative Layout Shift", {
              correlationId,
              operation: "cls",
              value: clsValue.toFixed(4),
            });
          }
        };

        window.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            sendCLS();
          }
        });

        return () => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.error("PerformanceObserver error:", error);
      }
    }
  }, [correlationId]);

  return null;
}
