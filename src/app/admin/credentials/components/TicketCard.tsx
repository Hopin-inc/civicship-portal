"use client";

import { Card } from "@/components/ui/card";

type TicketCardProps = {
  qty?: number;
  createdAt?: string;
  title?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export function TicketCard({
  title,
  isSelected,
  onClick,
}: TicketCardProps) {
  return (
    <Card
      className={`transition-colors p-4 ${
        onClick ? "cursor-pointer hover:bg-muted" : "opacity-50 pointer-events-none"
      } ${isSelected ? "border-primary" : ""}`}
      onClick={onClick}
    >
      <p className="text-body-md font-medium mt-2">{title ?? "チケット"}</p>
    </Card>
  );
}
