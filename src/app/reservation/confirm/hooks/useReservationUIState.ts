"use client";

import { useState, useCallback } from "react";

export const useReservationUIState = () => {
  const [useTickets, setUseTickets] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const memoizedSetUseTickets = useCallback((value: boolean) => {
    setUseTickets(value);
  }, []);

  const memoizedSetIsLoginModalOpen = useCallback((value: boolean) => {
    setIsLoginModalOpen(value);
  }, []);

  return {
    useTickets,
    setUseTickets: memoizedSetUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen: memoizedSetIsLoginModalOpen,
  };
};
