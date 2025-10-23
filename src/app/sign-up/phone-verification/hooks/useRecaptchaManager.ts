"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useRecaptchaManager(containerId: string = "recaptcha-container") {
  const [isReady, setIsReady] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const handleRecaptchaCompleted = () => {
      setShowRecaptcha(false);
    };

    window.addEventListener("recaptcha-completed", handleRecaptchaCompleted);

    return () => {
      window.removeEventListener("recaptcha-completed", handleRecaptchaCompleted);
    };
  }, []);

  const show = useCallback(() => {
    setShowRecaptcha(true);
  }, []);

  const hide = useCallback(() => {
    setShowRecaptcha(false);
  }, []);

  return {
    isReady,
    showRecaptcha,
    containerRef,
    show,
    hide,
  };
}
