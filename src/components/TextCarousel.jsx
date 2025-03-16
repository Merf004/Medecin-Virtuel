import React, { useState, useEffect } from 'react';

const TextCarousel = ({ texts, interval }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const nextIndex = (currentIndex + 1) % texts.length;
        const timer = setInterval(() => {
            setCurrentIndex(nextIndex);
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, texts.length, interval]);

    return (
        <div style={{ fontSize: '22px', textAlign: 'center', padding: '20px' }}>
            {texts[currentIndex]}
        </div>
    );
};

export default TextCarousel;