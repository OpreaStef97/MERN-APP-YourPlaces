import { RefObject, useCallback, useEffect, useState } from 'react';

const useClickOutside = <T>(wrapperRef: RefObject<T>) => {
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (
                wrapperRef.current &&
                !(wrapperRef.current as unknown as Element).contains(event.target as Element)
            ) {
                setClicked(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, clicked]);

    const clearClick = useCallback(() => setClicked(false), []);

    return { clicked, clearClick };
};

export default useClickOutside;
