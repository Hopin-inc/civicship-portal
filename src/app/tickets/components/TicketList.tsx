"use client";

import Image from "next/image";
import { Ticket as TicketIcon } from "lucide-react";
import { TicketClaimLink } from "@/app/tickets/data/type";
import React from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface TicketListProps {
  tickets: TicketClaimLink[];
}

export default function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="space-y-4">
      { tickets.map((ticket) => (
        <div key={ ticket.id } className="bg-background rounded-[20px] p-6 border border-input">
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
              <div className="flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-[#4361EE]" />
                <span className="text-[#4361EE] font-medium">{ticket.qty}枚</span>
              </div>
            </div>
            <Link
              href={ `/search/result?type=activity&q=${ encodeURIComponent(ticket.hostName) }&useTicket=true` }
              className={ buttonVariants({ variant: "secondary", size: "md" }) }
            >
              体験を探す
            </Link>
          </div>
          <p className="mt-4 text-foreground">{ ticket.hostName }さんからの招待</p>
        </div>
      )) }
    </div>
  );
}
