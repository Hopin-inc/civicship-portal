"use client";

import { Card } from "@/components/ui/card";

type TicketCardProps = {
  qty?: number;
  createdAt?: string;
  title?: string;
  isSelected?: boolean;
  onClick?: () => void;
  name?: string;
};

export function TicketCard({
  title,
  isSelected,
  onClick,
  name = "ticket",
}: TicketCardProps) {
  return (
    <Card
      className={`transition-colors p-4 flex items-center gap-2 ${
        onClick ? "cursor-pointer hover:bg-muted" : "opacity-50 pointer-events-none"
      } ${isSelected ? "border-primary" : ""}`}
      onClick={onClick}
    >
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        name={name}
        className="mr-2"
        tabIndex={-1}
      />
      <p className="text-body-md font-medium mt-2">{title ?? "チケット"}</p>
    </Card>
  );
}
