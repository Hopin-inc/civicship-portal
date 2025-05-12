import { useState } from "react";

export function useTicketCounter(maxTickets: number) {
  const [count, setCount] = useState(1);

  const increment = () => setCount((prev) => Math.min(prev + 1, maxTickets));
  const decrement = () => setCount((prev) => Math.max(prev - 1, 1));

  return {
    count,
    increment,
    decrement,
  };
}
