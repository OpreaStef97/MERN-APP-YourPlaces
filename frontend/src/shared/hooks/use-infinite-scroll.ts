import { useRef, useCallback } from 'react';

export default function useInfiniteScroll({
    isLoading,
    hasMore,
    setPage,
}: {
    isLoading: boolean;
    hasMore: boolean;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
    const observer = useRef<IntersectionObserver>();

    const lastItem = useCallback(
        node => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    hasMore && setPage(prev => ++prev);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore, isLoading, setPage]
    );

    return lastItem;
}
