import { useRef, useEffect, useLayoutEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useInfiniteScroll = ({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 0.1,
  }: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const onLoadMoreRef = useRef(onLoadMore);
  const pendingRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    if (!isLoading) {
      pendingRef.current = false;
    }
  }, [isLoading]);

  const setTargetRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    const observer = new IntersectionObserver(
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

    observer.observe(node);
    observerRef.current = observer;
  }, [threshold]);

  return setTargetRef;
};
