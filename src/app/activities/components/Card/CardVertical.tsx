import Image from "next/image";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ActivityCard } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { buildOpportunityQuery } from "@/app/activities/utils";

export default function OpportunityCardVertical({ opportunity }: { opportunity: ActivityCard }) {
  const { id, title, feeRequired, location, images, hasReservableTicket, communityId } =
    opportunity;

  return (
    <Link
      href={`/activities/${id}?community_id=${communityId}`}
      className="relative w-[164px] flex-shrink-0"
    >
      <Card className="w-[164px] h-[205px] overflow-hidden relative">
        {hasReservableTicket && (
          <div className="absolute top-2 left-2 bg-primary-foreground text-primary px-2.5 py-1 rounded-xl text-label-xs font-bold z-10">
            チケット利用可
          </div>
        )}
        <Image
          src={images?.[0] || PLACEHOLDER_IMAGE}
          alt={title}
          width={400}
          height={400}
          sizes="164px"
          placeholder={`blur`}
          blurDataURL={PLACEHOLDER_IMAGE}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Card>
      <div className="mt-3">
        <h3 className="text-title-sm text-foreground line-clamp-2">{title}</h3>
        <div className="mt-2 flex flex-col">
          <p className="text-body-sm text-muted-foreground">
            {feeRequired ? `1人あたり${feeRequired.toLocaleString()}円から` : "要問い合わせ"}
          </p>
          <div className="flex items-center text-body-sm text-muted-foreground mt-1">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 break-words">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
