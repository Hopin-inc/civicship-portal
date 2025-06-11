"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TicketReceiveActionButton from "./TicketReceiveActionButton";

interface TicketReceiveContentProps {
  user: any;
  claimLinkData: {
    qty: number;
    issuer: {
      owner: {
        id: string;
        name: string;
        image: string | null;
      },
      qtyToBeIssued: number;
    };
  };
  hasIssued: boolean;
  isClaimLoading: boolean;
  onClaimClick: () => void;
  onLoginClick: () => void;
}

const TicketReceiveContent: React.FC<TicketReceiveContentProps> = ({
                                                                     user,
                                                                     claimLinkData,
                                                                     hasIssued,
                                                                     isClaimLoading,
                                                                     onClaimClick,
                                                                     onLoginClick,
                                                                   }) => {
  const { qty: qtyIssued, issuer } = claimLinkData;
  const { owner, qtyToBeIssued } = issuer;

  return (
    <Card className="flex-1 min-h-0 grid content-center gap-6 p-6 w-full">
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-center text-body-lg">
          <span className="text-display-md">{ owner.name }</span>
          さんから
          <br />
          招待チケットが届きました！
        </p>
        <Avatar className="inline-block border-2 w-[120px] h-[120px]">
          { owner.image ? (
            <AvatarImage src={ owner.image } alt={ owner.name } />
          ) : (
            <AvatarFallback className="text-4xl">{ owner.name.charAt(0) }</AvatarFallback>
          ) }
        </Avatar>
        <div className="m-6 flex flex-col gap-2">
          <div className="flex gap-4 items-baseline">
            <p className="text-caption w-8 min-w-8">枚数</p>
            <p className="flex-grow">{ qtyToBeIssued - qtyIssued } 枚</p>
          </div>
          <div className="flex gap-4 items-baseline">
            <p className="text-caption w-8 min-w-8">用途</p>
            <p className="flex-grow">{ owner.name }さんが主催する体験に無料参加できます</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-primary-foreground">
        <p className="text-title-sm font-bold">お願い🙏</p>
        <ul className="text-body-sm list-disc">
          <li>ぜひ誰かを誘って参加してください！</li>
          <li>当日の様子を写真に撮って、投稿しましょう！関わりを残せます！</li>
        </ul>
      </div>
      <TicketReceiveActionButton
        user={ user }
        hasIssued={ hasIssued }
        isClaimLoading={ isClaimLoading }
        onClaimClick={ onClaimClick }
        onLoginClick={ onLoginClick }
        ownerName={ owner.name }
      />
    </Card>
  );
};

export default TicketReceiveContent;
