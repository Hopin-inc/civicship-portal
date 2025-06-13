"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TicketReceiveActionButton from "./TicketReceiveActionButton";
import { useReadMore } from "@/hooks/useReadMore";
import { Button } from "@/components/ui/button";

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
      utility: {
        name: string;
        description?: string;
      };
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

  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: issuer.utility.description ?? "",
    maxLines: 4,
  });

  return (
    <Card className="flex-1 min-h-0 grid content-center gap-4 p-6">
      <div className="flex flex-col justify-center items-center gap-4">
        <p className="text-center text-body-lg break-keep wrap-break-word">
          <span className="text-display-md break-all">{ owner.name }</span>
          さんから
          <wbr />
          招待チケット
          { hasIssued ? (<>
            を
            <wbr />
            受け取りました！
          </>) : (<>
            が
            <wbr />
            届きました！
          </>) }
        </p>
        <div className="flex flex-col justify-center items-center gap-2">
          <Avatar className="inline-block border-2 w-[96px] h-[96px]">
            { owner.image ? (
              <AvatarImage src={ owner.image } alt={ owner.name } />
            ) : (
              <AvatarFallback className="text-4xl">{ owner.name.charAt(0) }</AvatarFallback>
            ) }
          </Avatar>
          <div className="mx-6 flex flex-col gap-2">
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
      </div>
      { issuer.utility.description && (
        <div className="p-4 bg-primary-foreground">
          <p className="font-bold">{ owner.name }さんからのメッセージ</p>
          <div className="relative">
            <div
              ref={ textRef }
              className="text-body-sm text-foreground whitespace-pre-line transition-all duration-300 text-left"
              style={ getTextStyle() }
            >
              { issuer.utility.description }
            </div>
            { showReadMore && !expanded && (
              <div className="absolute bottom-0 left-0 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-foreground to-transparent"></div>
                <div className="relative flex justify-center pt-8">
                  <Button variant="tertiary" size="sm" onClick={ toggleExpanded } className="bg-white px-6">
                    <span className="text-label-sm font-bold">もっと見る</span>
                  </Button>
                </div>
              </div>
            ) }
          </div>
        </div>
      ) }
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
