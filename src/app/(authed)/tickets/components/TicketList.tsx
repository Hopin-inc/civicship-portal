"use client";

import Image from "next/image";
import { Ticket as TicketIcon } from "lucide-react";
import { TicketClaimLink } from "@/app/tickets/data/type";
import React from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TicketListProps {
  tickets: TicketClaimLink[];
}

export default function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="space-y-4">
      { tickets.map((ticket) => (
        <div key={ ticket.id } className="bg-background rounded-xl p-6 border border-input space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={ ticket.hostImage ?? PLACEHOLDER_IMAGE }
                  alt={ ticket.hostName }
                  fill
                  placeholder={ `blur` }
                  blurDataURL={ PLACEHOLDER_IMAGE }
                  className="object-cover"
                  onError={ (e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = PLACEHOLDER_IMAGE;
                  } }
                />
              </div>
              <div>
                <p className="text-body-lg">
                  <span className="font-bold">{ ticket.hostName }</span>
                  さんからの招待
                </p>
                <p className="flex items-center gap-2">
                  <TicketIcon className="w-5 h-5" />
                  <span className="font-medium">{ ticket.qty }枚</span>
                </p>
              </div>
            </div>
          </div>
          <Link
            href={ `/search/result?type=activity&q=${ encodeURIComponent(ticket.hostName) }&useTicket=true` }
            className={ cn(buttonVariants({ variant: "secondary", size: "md" }), "w-full") }
          >
            体験を探す
          </Link>
        </div>
      )) }
    </div>
  );
}
