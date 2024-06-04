import { useState, useEffect } from 'react';

export const useDebounce = <T>(value:T, ms: number = 300) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value); 
    
    useEffect(() => {
        const timeout = setTimeout(() => {
        setDebouncedValue(value);
        }, ms);

        return () => clearTimeout(timeout);
    }, [value, ms]);

    return debouncedValue;
}
