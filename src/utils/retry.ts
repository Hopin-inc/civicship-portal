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
        console.error(`Operation failed after ${retries} retries:`, error);
        throw error;
      }
      
      console.log(`Retry attempt ${currentRetry}/${retries} after ${currentDelay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      currentDelay *= factor;
    }
  }
}
