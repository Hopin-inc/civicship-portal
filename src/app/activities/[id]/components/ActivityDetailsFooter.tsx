"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ActivityDetailsFooterProps {
  opportunityId: string;
  price: number;
  communityId: string | undefined;
}

const ActivityDetailsFooter: React.FC<ActivityDetailsFooterProps> = ({
  opportunityId,
  price,
  communityId,
}) => {
  const query = new URLSearchParams({
    id: opportunityId,
    community_id: communityId ?? "",
  });

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="max-w-mobile-l mx-auto px-4 h-16 flex items-center justify-between w-full">
        <div>
          <p className="text-body-sm text-muted-foreground">1人あたり</p>
          <p className="text-bodylg font-bold">{price.toLocaleString()}円〜</p>
        </div>
        <Link href={`/reservation/select-date?${query.toString()}`}>
          <Button variant="primary" size="md" className="px-6">
            日付を選択
          </Button>
        </Link>
      </div>
    </footer>
  );
};

export default ActivityDetailsFooter;
