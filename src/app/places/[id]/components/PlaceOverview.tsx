"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";
import { useReadMore } from "@/hooks/useReadMore";
import { BaseDetail } from "@/app/places/data/type";

const INITIAL_DISPLAY_LINES = 6;

interface PlaceOverviewProps {
  detail: BaseDetail;
}

export const PlaceOverview = ({ detail }: PlaceOverviewProps) => {

  return (
    <div className="px-4 pt-2 pb-4 max-w-mobile-l mx-auto space-y-4">
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex items-center gap-1 text-body-sm gap-x-1">
          <MapPin className="h-5 w-5" />
          <span className="text-body-md font-bold">{detail.name}</span>
        </div>
        <div className="flex items-center gap-1 text-body-sm text-muted-foreground gap-x-1">
          <Users className="h-5 w-5 text-caption" />
          <span className="text-body-md text-caption">{detail.participantCount}人</span>
        </div>
      </div>
      <h2 className="text-display-md">{detail.headline}</h2>
      <PlaceDescription bio={detail.bio} />
    </div>
  );
};

const PlaceDescription = ({ bio }: { bio: string }) => {
  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: bio,
    maxLines: INITIAL_DISPLAY_LINES
  });

  return (
    <div className="relative">
      <p
        ref={textRef}
        className="text-body-md text-foreground whitespace-pre-wrap transition-all duration-300"
        style={getTextStyle()}
      >
        {bio}
      </p>
      {showReadMore && !expanded && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="relative flex justify-center pt-8">
            <Button
              variant="tertiary"
              size="sm"
              onClick={toggleExpanded}
              className="bg-white px-6"
            >
              <span className="text-label-sm font-bold">もっと見る</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};