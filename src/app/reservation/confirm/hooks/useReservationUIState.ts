import { useState } from "react";

export const useReservationUIState = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [useTickets, setUseTickets] = useState(false);
  const [ageComment, setAgeComment] = useState<string | null>(null); // ★追加

  console.log(ageComment, "ageComment");

  return {
    isLoginModalOpen,
    setIsLoginModalOpen,
    useTickets,
    setUseTickets,
    ageComment,
    setAgeComment, // ★追加
  };
};
