"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface UserPointRowProps {
  avatar: string;
  name: string;
  subText: string;
  pointValue: number; // 表示用の値という意味を明確化
  onClick?: () => void;
  selected?: boolean; // 選択状態
}

export function UserPointRow({
  avatar,
  name,
  subText,
  pointValue,
  onClick,
  selected,
}: UserPointRowProps) {
  return (
    <TableRow
      onClick={onClick}
      className={`${onClick ? "cursor-pointer hover:bg-muted/50" : ""} ${selected ? "bg-primary/5 border-l-2 border-primary" : ""}`}
      data-state={selected ? "selected" : undefined}
    >
      <TableCell>
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="flex-shrink-0">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">{name}</div>
            <div className="text-sm text-muted-foreground truncate">{subText}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="align-middle w-24">
        <div className="flex justify-end items-center h-full text-muted-foreground">
          {pointValue.toLocaleString()}
          <span className="text-xs ml-0.5">pt</span>
          {selected && <Check className="h-5 w-5 text-primary ml-3" />}
        </div>
      </TableCell>
    </TableRow>
  );
}
