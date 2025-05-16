'use client';

import { useEffect, useState, useRef, useCallback, CSSProperties } from 'react';

interface UseReadMoreProps {
  text: string;
  maxLines?: number;
}

export const useReadMore = ({ text, maxLines = 6 }: UseReadMoreProps) => {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  const calculateLines = useCallback(() => {
    if (!textRef.current) return 0;

    const style = window.getComputedStyle(textRef.current);
    const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.5;
    const height = textRef.current.scrollHeight;
    return Math.floor(height / lineHeight);
  }, []);

  useEffect(() => {
    const lines = calculateLines();
    setShowReadMore(lines > maxLines);

    const handleResize = () => {
      const lines = calculateLines();
      setShowReadMore(lines > maxLines);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLines, maxLines, text]);

  const toggleExpanded = () => setExpanded(true);

  const getTextStyle = (): CSSProperties => {
    if (expanded || !showReadMore) return {};

    return {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    } as CSSProperties;
  };

  return {
    textRef,
    expanded,
    showReadMore,
    toggleExpanded,
    getTextStyle,
  };
};
