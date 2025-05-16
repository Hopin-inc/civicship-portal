import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCardInfo } from "@/app/places/data/type";

interface PlaceCardProps {
  place: BaseCardInfo;
  selected: boolean;
  onClick: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, selected, onClick }) => (
  <Card
    className={`w-full transition-transform duration-200 ${
      selected ? "scale-[1.02]" : "scale-100"
    }`}
  >
    <div className="relative h-32 rounded-t-lg overflow-hidden">
      <Image
        src={place.image ?? PLACEHOLDER_IMAGE}
        alt={place.headline}
        className="object-cover"
        fill
        placeholder={`blur`}
        blurDataURL={PLACEHOLDER_IMAGE}
        sizes="(max-width: 768px) 100vw, 320px"
      />
    </div>
    <CardContent className="flex flex-col min-h-[160px] px-4 py-3">
      {/*//TODO 適切に1行に収めるか、name, addressで2行にした方が良い？ユーザーがどの地域なのか分からない問題を解消したい*/}
      <div className="flex items-center justify-between mb-1">
        <div className="mt-1 flex items-center text-foreground text-body-xs">
          <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
          <div className="flex-1 max-w-[80%] flex overflow-hidden">
            <span className="truncate font-bold">{place.name}</span>
            <span className="truncate text-muted-foreground">{`（${place.address}）`}</span>
          </div>
        </div>
        <div className="mt-1 flex items-center text-muted-foreground text-label-xs">
          <Users className="mr-1 h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1 break-words">{place.participantCount}人</span>
        </div>
      </div>

      <CardTitle className="text-title-sm line-clamp-1">{place.headline}</CardTitle>
      <CardDescription className="line-clamp-2 mb-2">{place.bio}</CardDescription>

      <CardFooter className="flex justify-between mt-2 p-0 mb-2">
        {place.publicOpportunityCount > 0 && (
          <span className="text-body-xs">
            <strong>{place.publicOpportunityCount}件</strong>の関わり方を募集中
          </span>
        )}
        <Button onClick={onClick}>もっと見る</Button>
      </CardFooter>
    </CardContent>
  </Card>
);

export default PlaceCard;
