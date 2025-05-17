"use client";

import { useState } from "react";

export const useReservationUIState = () => {
  const [useTickets, setUseTickets] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return {
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
  };
};
