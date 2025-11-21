"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export function useRecaptchaManager() {
  const [isReady, setIsReady] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  const show = useCallback(() => {
    setShowRecaptcha(true);
  }, []);

  const hide = useCallback(() => {
    setShowRecaptcha(false);
  }, []);

  useEffect(() => {
    window.addEventListener("recaptcha-completed", hide);

    return () => {
      window.removeEventListener("recaptcha-completed", hide);
    };
  }, [hide]);

  return {
    isReady,
    showRecaptcha,
    containerRef,
    show,
    hide,
  };
}
