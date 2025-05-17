'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Header component for the reservation completion page
 */
const CompletionHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-12 max-w-mobile-l mx-auto w-full">
      <div className="flex items-center justify-center">
        <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-[#4169E1]" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold mt-2">申し込み完了</h2>
    </div>
  );
};

export default CompletionHeader;
