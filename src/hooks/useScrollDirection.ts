import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: ScrollDirection;
}

export const useScrollDirection = ({
  threshold = 10,
  initialDirection = null,
}: UseScrollDirectionOptions = {}) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(initialDirection);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - prevScrollY;

      if (Math.abs(diff) > threshold) {
        const newDirection = diff > 0 ? "down" : "up";

        if (newDirection !== scrollDirection) {
          setScrollDirection(newDirection);
          setIsVisible(newDirection === "up" || currentScrollY < threshold);
        }

        setPrevScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollDirection, prevScrollY, threshold]);

  return { scrollDirection, isVisible };
};
