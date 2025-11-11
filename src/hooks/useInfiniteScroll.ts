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
  
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const onLoadMoreRef = useRef(onLoadMore);
  const pendingRef = useRef(false); // Prevent duplicate calls while loading

  useEffect(() => {
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasMoreRef.current &&
          !isLoadingRef.current &&
          !pendingRef.current
        ) {
          pendingRef.current = true;
          onLoadMoreRef.current();
        }
      },
      { threshold }
    );

    observer.current.observe(el);

    return () => {
      observer.current?.unobserve(el);
      observer.current?.disconnect();
    };
  }, [threshold]); // Only depend on threshold, not hasMore/isLoading/onLoadMore

  useEffect(() => {
    if (!isLoading) {
      pendingRef.current = false;
    }
  }, [isLoading]);

  return targetRef;
};
