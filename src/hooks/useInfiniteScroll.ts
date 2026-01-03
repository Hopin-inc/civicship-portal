import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

  console.log("[useInfiniteScroll] Hook called with:", { hasMore, isLoading, threshold });

  useIsomorphicLayoutEffect(() => {
    console.log("[useInfiniteScroll] Updating refs:", { hasMore, isLoading });
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    if (!isLoading) {
      console.log("[useInfiniteScroll] isLoading became false, resetting pendingRef");
      pendingRef.current = false;
    }
  }, [isLoading]);

  return useCallback(
    (node: HTMLDivElement | null) => {
      console.log("[useInfiniteScroll] Callback ref called with node:", node ? "HTMLDivElement" : "null");
      
      if (observerRef.current) {
        console.log("[useInfiniteScroll] Disconnecting existing observer");
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) {
        console.log("[useInfiniteScroll] Node is null, returning early");
        return;
      }

      console.log("[useInfiniteScroll] Creating new IntersectionObserver");
      const observer = new IntersectionObserver(
        ([entry]) => {
          console.log("[useInfiniteScroll] IntersectionObserver callback:", {
            isIntersecting: entry.isIntersecting,
            hasMoreRef: hasMoreRef.current,
            isLoadingRef: isLoadingRef.current,
            pendingRef: pendingRef.current,
          });
          if (
            entry.isIntersecting &&
            hasMoreRef.current &&
            !isLoadingRef.current &&
            !pendingRef.current
          ) {
            console.log("[useInfiniteScroll] All conditions met, calling onLoadMore");
            pendingRef.current = true;
            onLoadMoreRef.current();
          } else {
            console.log("[useInfiniteScroll] Conditions NOT met:", {
              isIntersecting: entry.isIntersecting,
              hasMore: hasMoreRef.current,
              notLoading: !isLoadingRef.current,
              notPending: !pendingRef.current,
            });
          }
        },
        { threshold },
      );

      observer.observe(node);
      observerRef.current = observer;
      console.log("[useInfiniteScroll] Observer attached to node");
    },
    [threshold],
  );
};
