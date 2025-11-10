import { useState, useCallback } from "react";

export const useReservationUIState = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [useTickets, setUseTickets] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [ageComment, setAgeComment] = useState<string | null>(null);
  const [organizerMessage, setOrganizerMessage] = useState<string | null>(null);
  const [lockedByPointsOnly, setLockedByPointsOnly] = useState(false);

  const setUsePointsWithLock = useCallback((value: boolean) => {
    if (!lockedByPointsOnly) {
      setUsePoints(value);
    }
  }, [lockedByPointsOnly]);

  const lockPointsToggle = useCallback(() => {
    setUsePoints(true);
    setLockedByPointsOnly(true);
  }, []);

  return {
    isLoginModalOpen,
    setIsLoginModalOpen,
    useTickets,
    setUseTickets,
    ageComment,
    setAgeComment,
    organizerMessage,
    setOrganizerMessage,
    usePoints,
    setUsePoints: setUsePointsWithLock,
    lockedByPointsOnly,
    lockPointsToggle,
  };
};
