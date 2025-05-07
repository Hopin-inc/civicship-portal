'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const TicketHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b max-w-mobile-l mx-auto w-full h-14 flex items-center px-4">
      <Button 
        variant="link" 
        className="absolute left-4 p-2" 
        onClick={() => window.history.back()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      <h1 className="flex-1 text-center text-lg font-bold truncate">チケット</h1>
      <div className="w-10 absolute right-4"></div>
    </header>
  );
};

export default TicketHeader;
