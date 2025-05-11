'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface WalletActionButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const WalletActionButton: React.FC<WalletActionButtonProps> = ({ 
  onClick,
  children
}) => {
  return (
    <Button 
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default WalletActionButton;
