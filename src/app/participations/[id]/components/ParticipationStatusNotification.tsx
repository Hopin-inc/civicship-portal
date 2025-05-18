"use client";

import React from "react";
import { AlertCircle, Check } from "lucide-react";
import { GqlReservationStatus } from "@/types/graphql";
import { ParticipationUIStatus } from "@/app/participations/[id]/page";

interface StatusProps {
  status: ParticipationUIStatus;
  statusText: string;
  statusSubText?: string;
  statusClass: string;
}

const ParticipationStatusNotification: React.FC<StatusProps> = ({
  status,
  statusText,
  statusSubText,
  statusClass,
}) => {
  return (
    <div className={`p-3 rounded-xl border-[1px] ${statusClass} mb-6`}>
      <div className="flex items-start gap-2">
        {status === "confirmed" ? (
          <Check className="w-5 h-5 mt-[3px] text-green-600" />
        ) : (
          <AlertCircle
            className={`w-5 h-5 mt-[3px] ${
              status === "cancelled" ? "text-red-600" : "text-yellow-600"
            }`}
          />
        )}
        <div className="flex-1">
          <p className="font-bold leading-6">{statusText}</p>
          {statusSubText && <p className="text-sm text-muted-foreground mt-1">{statusSubText}</p>}
        </div>
      </div>
    </div>
  );
};

export default ParticipationStatusNotification;
