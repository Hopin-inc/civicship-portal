'use client';

import { useRef, useEffect } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

/**
 * Hook for implementing infinite scrolling
 * Returns a ref to be attached to the last item in the list
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold }
    );

    if (targetRef.current) {
      observer.current.observe(targetRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return targetRef;
};
