// src/hooks/useSimulatedLoading.js

import { useEffect, useState } from "react";

export const useSimulatedLoading = (initialState = true, delay = 2000) => {
    const [loading, setLoading] = useState(initialState);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return loading;
};

