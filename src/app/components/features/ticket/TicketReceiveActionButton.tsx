'use client';

import React from 'react';
import { Button, buttonVariants } from "@/app/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface TicketReceiveActionButtonProps {
  user: any;
  hasIssued: boolean;
  isClaimLoading: boolean;
  onClaimClick: () => void;
  onLoginClick: () => void;
  ownerName: string;
}

const TicketReceiveActionButton: React.FC<TicketReceiveActionButtonProps> = ({
  user,
  hasIssued,
  isClaimLoading,
  onClaimClick,
  onLoginClick,
  ownerName,
}) => {
  if (!user) {
    return (
      <Button size="lg" onClick={onLoginClick}>
        ログインして獲得する
      </Button>
    );
  } else if (isClaimLoading) {
    return (
      <Button size="lg" disabled>
        <Loader2 className="animate-spin mr-2" />
        チケット発行中
      </Button>
    );
  } else if (!hasIssued) {
    return (
      <Button size="lg" onClick={onClaimClick}>
        チケットを獲得する
      </Button>
    );
  } else {
    return (
      <Link
        href={`/search/result?type=activity&q=${encodeURIComponent(ownerName)}&useTicket=true`}
        className={buttonVariants({ variant: "secondary", size: "lg" })}
      >
        体験を探す
      </Link>
    );
  }
};

export default TicketReceiveActionButton;
