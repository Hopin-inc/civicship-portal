"use client";

import { useCallback, useEffect, useState } from "react";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";

/**
 * Hook for managing resend timer countdown
 *
 * Provides countdown functionality to prevent users from spamming
 * the resend verification code button.
 *
 * @param initialSeconds - Initial countdown duration in seconds
 * @returns Timer state and control functions
 *
 * @example
 * ```typescript
 * const { isDisabled, countdown, start } = useResendTimer();
 *
 * // After sending code
 * start();
 *
 * // Button disabled state
 * <button disabled={isDisabled}>
 *   {isDisabled ? `${countdown}秒後に再送信できます` : "コードを再送信"}
 * </button>
 * ```
 */
export function useResendTimer(
  initialSeconds: number = PHONE_VERIFICATION_CONSTANTS.RESEND_COUNTDOWN_SECONDS,
) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(initialSeconds);

  /**
   * Starts the countdown timer
   */
  const start = useCallback(() => {
    setCountdown(initialSeconds);
    setIsDisabled(true);
  }, [initialSeconds]);

  /**
   * Resets the timer to initial state
   */
  const reset = useCallback(() => {
    setCountdown(initialSeconds);
    setIsDisabled(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isDisabled) {
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        setIsDisabled(false);
        return 0;
      });
    }, PHONE_VERIFICATION_CONSTANTS.INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isDisabled]);

  return {
    /**
     * Whether the resend button should be disabled
     */
    isDisabled,

    /**
     * Current countdown value in seconds
     */
    countdown,

    /**
     * Start the countdown timer
     */
    start,

    /**
     * Reset the timer to initial state
     */
    reset,
  };
}
