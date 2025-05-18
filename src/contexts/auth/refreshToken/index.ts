import retry from "retry";
import categorizeFirebaseError from "@/lib/firebase/const";

const getRetryOptions = () => ({
  retries: 3,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 10000,
  randomize: true,
});

const handleError = (error: any, categorizedError: any, currentAttempt: number, operation: any) => {
  console.error(`Token refresh error (attempt ${currentAttempt}):`, {
    type: categorizedError.type,
    message: categorizedError.message,
    error,
    retryable: categorizedError.retryable,
  });

  if (!categorizedError.retryable || !operation.retry(error)) {
    console.error("Token refresh failed after all retries");

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth:token-refresh-failed", {
          detail: {
            source: "token-refresh",
            errorType: categorizedError.type,
            errorMessage: categorizedError.message,
            originalError: error,
          },
        }),
      );
    }
    return null;
  }
  return undefined;
};

const refreshAuthToken = async (user: {
  getIdToken: (forceRefresh: boolean) => Promise<string>;
}): Promise<string | null> => {
  const operation = retry.operation(getRetryOptions());

  return new Promise((resolve) => {
    operation.attempt(async (currentAttempt) => {
      try {
        console.log(`Attempting to refresh auth token (attempt ${currentAttempt})`);

        const idToken = await user.getIdToken(true);
        console.log("Token refresh successful");

        resolve(idToken);
      } catch (error) {
        const categorizedError = categorizeFirebaseError(error);

        const result = handleError(error, categorizedError, currentAttempt, operation);

        if (result === null) {
          resolve(null);
        }
      }
    });
  });
};

export default refreshAuthToken;
