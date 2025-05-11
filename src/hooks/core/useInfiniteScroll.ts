import { useRef, useEffect } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 0.1,
  }: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold }
    );

    observer.current.observe(el);

    return () => {
      observer.current?.unobserve(el);
      observer.current?.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return targetRef;
};
