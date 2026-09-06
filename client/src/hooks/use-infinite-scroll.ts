import { useEffect, useRef } from 'react';
import type { UseInfiniteScrollOptions } from '../types/useInfiniteScrollOptions';


export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || !hasMore) return;

    const observer = new IntersectionObserver(([entries]) => {
      if (entries.isIntersecting) {
        onLoadMore();
      }
    },{
      rootMargin: "400px"
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    }
  }, [loading, hasMore, onLoadMore]);

  return sentinelRef;
}