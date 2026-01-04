import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 50) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!text) {
            setDisplayText('');
            setIsComplete(true);
            return;
        }

        let currentIndex = 0;
        setDisplayText('');
        setIsComplete(false);

        const interval = setInterval(() => {
            setDisplayText(text.slice(0, currentIndex + 1));
            currentIndex++;

            if (currentIndex >= text.length) {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    const skipToEnd = () => {
        setDisplayText(text);
        setIsComplete(true);
    };

    return { displayText, isComplete, skipToEnd };
};
