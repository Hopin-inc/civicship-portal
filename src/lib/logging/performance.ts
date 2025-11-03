import { logger } from "@/lib/logging";

interface PerformanceMeasurement {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * パフォーマンス計測ユーティリティ
 *
 * 環境変数 NEXT_PUBLIC_ENABLE_PERFORMANCE_TRACKING=true で有効化
 *
 * 使用例:
 * ```typescript
 * // 方法1: 手動でstart/end
 * performanceTracker.start("my-operation");
 * // ... 処理 ...
 * performanceTracker.end("my-operation", { custom: "metadata" });
 *
 * // 方法2: 非同期関数を自動計測
 * const result = await performanceTracker.measure(
 *   "my-operation",
 *   async () => { return await fetchData(); },
 *   { custom: "metadata" }
 * );
 * ```
 */
export class PerformanceTracker {
  private static enabled = true;
  private marks = new Map<string, number>();

  /**
   * 計測開始マーカーを設定
   * @param markName 計測対象の識別名
   */
  start(markName: string): void {
    if (!PerformanceTracker.enabled) return;
    this.marks.set(markName, performance.now());
  }

  /**
   * 計測終了し、結果をロギング
   * @param markName 計測対象の識別名（startで設定したものと同じ）
   * @param metadata 追加のメタデータ
   */
  end(markName: string, metadata?: Record<string, any>): void {
    if (!PerformanceTracker.enabled) return;

    const startTime = this.marks.get(markName);
    if (!startTime) {
      logger.warn(`Performance mark "${markName}" not found`, {
        component: "PerformanceTracker",
      });
      return;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(markName);

    logger.info(`⏱️ Performance: ${markName}`, {
      operation: markName,
      duration: `${duration.toFixed(2)}ms`,
      durationMs: duration,
      timestamp: Date.now(),
      component: "PerformanceTracker",
      ...metadata,
    });
  }

  /**
   * 非同期関数の実行時間を自動計測
   * @param operation 操作名
   * @param fn 計測対象の非同期関数
   * @param metadata 追加のメタデータ
   * @returns 関数の実行結果
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    if (!PerformanceTracker.enabled) {
      return fn();
    }

    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      logger.info(`⏱️ Performance: ${operation}`, {
        operation,
        duration: `${duration.toFixed(2)}ms`,
        durationMs: duration,
        status: "success",
        timestamp: Date.now(),
        component: "PerformanceTracker",
        ...metadata,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      logger.error(`⏱️ Performance: ${operation} (failed)`, {
        operation,
        duration: `${duration.toFixed(2)}ms`,
        durationMs: duration,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
        component: "PerformanceTracker",
        ...metadata,
      });

      throw error;
    }
  }
}

/**
 * グローバルパフォーマンストラッカーインスタンス
 */
export const performanceTracker = new PerformanceTracker();
