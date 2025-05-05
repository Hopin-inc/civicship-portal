'use client';

import React from 'react';
import { Button } from '@/app/components/ui/button';

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
      variant="primary"
      size="lg"
      className="w-full mb-8"
    >
      {children}
    </Button>
  );
};

export default WalletActionButton;
