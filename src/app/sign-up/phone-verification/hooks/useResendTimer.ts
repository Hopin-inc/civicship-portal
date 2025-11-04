"use client";

import { useCallback, useEffect, useState } from "react";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";

export function useResendTimer(
  initialSeconds: number = PHONE_VERIFICATION_CONSTANTS.RESEND_COUNTDOWN_SECONDS,
) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (!isDisabled) {
      setCountdown(initialSeconds);
    }
  }, [initialSeconds, isDisabled]);

  const start = useCallback(() => {
    setCountdown(initialSeconds);
    setIsDisabled(true);
  }, [initialSeconds]);

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
    isDisabled,
    countdown,
    start,
    reset,
  };
}
