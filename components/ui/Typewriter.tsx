import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 20, 
  onComplete,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset state immediately when text changes
    setDisplayedText('');
    
    if (!text) return;

    let startTime = performance.now();
    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const charCount = Math.floor(elapsed / speed);
      
      // We slice from the stable 'text' prop based on time elapsed
      // This prevents "append" bugs where characters get doubled
      const nextText = text.slice(0, charCount);
      setDisplayedText(nextText);

      if (charCount < text.length) {
        frameId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [text, speed, onComplete]);

  return <p className={className}>{displayedText}</p>;
};