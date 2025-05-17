import { useCallback, useState } from "react";

export function useTicketCounter(maxTickets: number) {
  const [count, setCount] = useState(1);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + 1, maxTickets));
  }, [maxTickets]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - 1, 1));
  }, []);

  const canIncrement = count < maxTickets;
  const canDecrement = count > 1;

  return {
    count,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  };
}

export type UseTicketCounterReturn = ReturnType<typeof useTicketCounter>;
