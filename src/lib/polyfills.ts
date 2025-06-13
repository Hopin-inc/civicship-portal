export function polyfillRequestIdleCallback(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.requestIdleCallback) {
    let lastId = 0;
    const timeouts = new Map<number, ReturnType<typeof setTimeout>>();

    window.requestIdleCallback = function(callback: IdleRequestCallback, options?: IdleRequestOptions): number {
      const id = ++lastId;
      const timeout = options?.timeout || 0;
      
      const timeoutId = setTimeout(() => {
        const start = performance.now();
        callback({
          didTimeout: timeout > 0,
          timeRemaining() {
            return Math.max(0, 16 - (performance.now() - start));
          }
        });
        timeouts.delete(id);
      }, 1);
      
      timeouts.set(id, timeoutId);
      return id;
    };
  }

  if (!window.cancelIdleCallback) {
    const timeouts = (window as unknown as { __idleCallbackTimeouts?: Map<number, ReturnType<typeof setTimeout>> }).__idleCallbackTimeouts || new Map<number, ReturnType<typeof setTimeout>>();
    (window as unknown as { __idleCallbackTimeouts: Map<number, ReturnType<typeof setTimeout>> }).__idleCallbackTimeouts = timeouts;
    
    window.cancelIdleCallback = function(id: number): void {
      const timeoutId = timeouts.get(id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeouts.delete(id);
      }
    };
  }
}
