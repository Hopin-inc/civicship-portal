'use client';

import { useEffect, useState, useRef } from 'react';

interface UseReadMoreProps {
  text: string;
  maxLines?: number;
}

export const useReadMore = ({ text, maxLines = 6 }: UseReadMoreProps) => {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.clientHeight;
      const lines = Math.floor(height / lineHeight);
      setShowReadMore(lines > maxLines);
    }
    // text が更新された際にも再判定したいので、deps に入れている
  }, [maxLines, text, textRef]);

  const toggleExpanded = () => setExpanded(true);

  return {
    textRef,
    expanded,
    showReadMore,
    toggleExpanded,
    getTextClassName: (baseClassName: string) =>
      `${baseClassName} transition-all duration-300 ${!expanded && showReadMore ? `line-clamp-${maxLines}` : ''}`
  };
};
