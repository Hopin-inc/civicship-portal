"use client";

import React, { useCallback, useState } from "react";
import { Calendar, MapPin, User } from "lucide-react";
import { formatDateTime } from "@/utils/date";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import SelectionSheet from "@/app/reservation/select-date/components/SelectionSheet";

interface ReservationDetailsCardProps {
  startDateTime: Date | null;
  endDateTime: Date | null;
  participantCount: number;
  location?: {
    name: string;
    address: string;
  };
  onChange: (newValue: number) => void;
}

const ReservationDetailsCard: React.FC<ReservationDetailsCardProps> = ({
  startDateTime,
  endDateTime,
  participantCount,
  location = { name: "場所未定", address: "場所未定" },
  onChange,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleOpen = useCallback(() => setIsSheetOpen(true), []);
  const handleClose = useCallback(() => setIsSheetOpen(false), []);

  if (!startDateTime || !endDateTime) return null;

  return (
    <div className="py-6 px-4 mb-6 space-y-3">
      <h2 className="text-display-sm">申込内容</h2>
      <div className="rounded-lg bg-card p-4 space-y-4">
        <div className="flex items-start gap-x-2">
          <Calendar size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-body-sm font-bold">
              {formatDateTime(startDateTime, "yyyy年M月d日（E）", { locale: ja })}
            </span>
            <span className="text-body-sm text-caption">
              {formatDateTime(startDateTime, "HH:mm")}-{formatDateTime(endDateTime, "HH:mm")}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <MapPin size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-body-sm font-bold">{location.name}</span>
            <span className="text-body-sm text-caption">{location.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <User size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
            <span className="text-body-sm font-bold">{participantCount}名</span>
          </div>
          <Button variant="tertiary" size="sm" onClick={handleOpen} className={"px-6"}>
            変更
          </Button>
        </div>
      </div>

      <SelectionSheet
        isOpen={isSheetOpen}
        onClose={handleClose}
        activeForm="guests"
        selectedDate={null}
        setSelectedDate={() => {}}
        selectedGuests={participantCount}
        setSelectedGuests={onChange}
        dateSections={[]} // ゲストのみ使うので空でOK
      />
    </div>
  );
};

export default ReservationDetailsCard;
