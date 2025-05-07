'use client';

import React from 'react';
import { X, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TicketDetailHeaderProps {
  eventName: string;
  eventUrl?: string;
  onShare?: () => void;
  onClose?: () => void;
}

/**
 * Header component for the ticket detail page
 */
export const TicketDetailHeader: React.FC<TicketDetailHeaderProps> = ({
  eventName,
  eventUrl,
  onShare,
  onClose
}) => {
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: eventName,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1 text-center">
          <h1 className="text-lg font-medium">{eventName}</h1>
          {eventUrl && (
            <p className="text-xs text-muted-foreground">{eventUrl}</p>
          )}
        </div>
        <div className="flex items-center space-x-4 absolute right-4">
          <Button 
            variant="link" 
            size="icon" 
            onClick={handleShare}
            className="p-2"
          >
            <Share className="h-6 w-6" />
          </Button>
          <Button 
            variant="link" 
            size="icon" 
            onClick={handleClose}
            className="p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TicketDetailHeader;
