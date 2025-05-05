import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Globe, MapPin } from "lucide-react";
import Link from "next/link";
import type { Opportunity } from "@/types";

type Props = {
  opportunity: Opportunity;
};

export const OpportunityDetailHeader = ({ opportunity }: Props) => {
  return (
    <>
      <div className="relative h-48 bg-gradient-to-b from-green-700 to-green-900">
        <div className="absolute inset-0">
          <Image
            src={opportunity.images?.[0] || "/placeholder.svg"}
            alt={opportunity.title}
            fill
            className="object-cover opacity-20"
          />
        </div>
      </div>

      <div className="relative -mt-8 bg-background rounded-t-3xl">
        <div className="container max-w-2xl mx-auto px-8 py-6">
          <div className="mb-8">
            <h1 className="mt-2 text-xl font-bold mb-4">{opportunity.title}</h1>

            <div className="grid gap-4 sm:grid-cols-2 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase py-0.5 rounded-t-lg w-full bg-secondary text-muted-foreground">
                    {format(new Date(opportunity.startsAt), "MMM")}
                  </span>
                  <span className="text-base font-bold leading-none border-2 w-full rounded-b-lg py-[3px] text-muted-foreground">
                    {format(new Date(opportunity.startsAt), "d")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    {format(new Date(opportunity.startsAt), "M月d日(E)", {
                      locale: ja,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(opportunity.startsAt), "HH:mm")} -{" "}
                    {format(new Date(opportunity.endsAt), "HH:mm")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  {opportunity?.location?.isOnline ? (
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{opportunity.location.name}</p>
                  {!opportunity?.location?.isOnline && (
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${opportunity.location.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                      Google Mapで見る
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
