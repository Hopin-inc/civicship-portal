'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ActivityDetailsFooterProps {
  opportunityId: string;
  price: number;
}

const ActivityDetailsFooter: React.FC<ActivityDetailsFooterProps> = ({
  opportunityId,
  price
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">1人あたり</p>
          <p className="text-xl font-bold">¥{price.toLocaleString()}</p>
        </div>
        <Link
          href={`/reservation/select-date?id=${opportunityId}`}
        >
          <Button
            variant="primary"
            className="px-8 py-3 rounded-lg font-medium"
          >
            予約する
          </Button>
        </Link>
      </div>
    </footer>
  );
};

export default ActivityDetailsFooter;
