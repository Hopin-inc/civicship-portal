"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { GqlOpportunity } from "@/types/graphql";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OpportunityListSheetProps {
  opportunities: GqlOpportunity[];
  utilityName: string;
  children: React.ReactNode;
}

export default function OpportunityListSheet({
                                               opportunities,
                                               utilityName,
                                               children,
                                             }: OpportunityListSheetProps) {
  const activityCards: ActivityCard[] = opportunities.map(presenterActivityCard);

  return (
    <Sheet>
      <SheetTrigger asChild>
        { children }
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
        <SheetHeader className="text-left pb-6">
          <SheetTitle>{ utilityName }</SheetTitle>
          <SheetDescription>
            このチケットは
            <span className="font-bold">{ activityCards.length }</span>
            件の体験で利用可能です。
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            { activityCards.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                関連する機会がありません
              </p>
            ) : (
              activityCards.map((opportunity: ActivityCard) => (
                <OpportunityCardHorizontal
                  key={ opportunity.id }
                  opportunity={ opportunity }
                  withShadow={ false }
                />
              ))
            ) }
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
