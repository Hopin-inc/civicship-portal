import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IPlaceCard } from "@/app/places/data/type";
import Link from "next/link";

interface PlaceCardProps {
  place: IPlaceCard;
  selected: boolean;
  buttonVariant?: "primary" | "tertiary";
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, selected, buttonVariant = "tertiary" }) => (
  <Link href={`/places/${place.id}`}>
    <Card
      className={`w-full overflow-hidden transition-transform duration-200 ${
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
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <CardContent className="flex flex-col px-4 py-3 w-full">
        <div className="flex items-center justify-between mb-2 w-full">
          <div className="mt-1 flex items-start text-foreground text-body-xs overflow-hidden">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-wrap overflow-hidden min-w-0 max-w-[248px]">
              <span className="font-bold text-body-xs truncate min-w-0 max-w-full mr-2">
                {place.name}
              </span>
              <span className="truncate text-caption text-body-xs min-w-0 max-w-full">
                {place.address}
              </span>
            </div>
          </div>
          <div className="mt-1 flex items-center text-caption text-label-xs flex-shrink-0">
            <Users className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 break-words">{place.participantCount}人</span>
          </div>
        </div>

        {place.headline && (
          <CardTitle className="text-title-sm line-clamp-1 mb-1 overflow-hidden">
            {place.headline}
          </CardTitle>
        )}
        {place.bio && (
          <CardDescription className="line-clamp-2 mb-2 text-body-xs text-caption overflow-hidden">
            {place.bio}
          </CardDescription>
        )}

        <CardFooter className="flex justify-between mt-2 p-0 mb-1 w-full">
          {place.publicOpportunityCount > 0 ? (
            <span className="text-body-xs text-caption truncate mr-2">
              <strong className="text-foreground mr-0.5">{place.publicOpportunityCount}件</strong>
              の関わり方を募集中
            </span>
          ) : (
            // レイアウト保持のために render
            <span className="text-body-xs text-caption"></span>
          )}
          <Button variant={buttonVariant} size={"sm"} className="flex-shrink-0">
            もっと見る
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  </Link>
);

export default PlaceCard;
