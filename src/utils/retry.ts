import clientLogger from "@/lib/logging/client";

/**
 * Utility function to retry an async operation with exponential backoff
 * @param operation The async operation to retry
 * @param retries Maximum number of retries
 * @param delay Initial delay in milliseconds
 * @param factor Exponential backoff factor
 * @returns Result of the operation or throws the last error
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500,
  factor = 2
): Promise<T> {
  let currentRetry = 0;
  let currentDelay = delay;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      currentRetry++;
      
      if (currentRetry > retries) {
        clientLogger.error(`Operation failed after ${retries} retries`, {
          error: error instanceof Error ? error.message : String(error),
          retries,
          component: "retryWithBackoff"
        });
        throw error;
      }
      
      clientLogger.debug(`Retry attempt ${currentRetry}/${retries} after ${currentDelay}ms`, {
        currentRetry,
        retries,
        currentDelay,
        component: "retryWithBackoff"
      });
      
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      currentDelay *= factor;
    }
  }
}
