import { useState, useCallback } from "react";

export function useTicketCounter(maxTickets: number) {
  const [count, setCount] = useState(1);

  const setCountMemoized = useCallback((value: number) => {
    setCount(value);
  }, []);

  const increment = useCallback(
    () => setCountMemoized(Math.min(count + 1, maxTickets)),
    [count, maxTickets, setCountMemoized]
  );
  
  const decrement = useCallback(
    () => setCountMemoized(Math.max(count - 1, 1)),
    [count, setCountMemoized]
  );

  return {
    count,
    increment,
    decrement,
  };
}

export type UseTicketCounterReturn = ReturnType<typeof useTicketCounter>;
