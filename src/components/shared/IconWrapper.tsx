'use client';

import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
  color?: 'default' | 'warning' | 'primary';
}

/**
 * Wrapper component for icons with consistent styling
 */
const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  color = 'default'
}) => {
  const colorClass =
    color === 'warning'
      ? 'text-[#F0B03C]'
      : color === 'primary'
      ? 'text-primary'
      : 'text-muted-foreground';

  return (
    <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center ${colorClass}`}>
      {children}
    </div>
  );
};

export default IconWrapper;
