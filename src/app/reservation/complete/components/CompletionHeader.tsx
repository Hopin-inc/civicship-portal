"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

/**
 * Header component for the reservation completion page
 */
const CompletionHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center pt-10 pb-6 max-w-mobile-l mx-auto w-full gap-y-2 px-6">
      <div className="flex items-center justify-center">
        <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="text-display-md">申し込み完了</h2>
      <p className="text-body-md text-caption">
        案内人が承認すると、予約が確定します｡ 予約確定時にはLINEにてお知らせします｡
      </p>
    </div>
  );
};

export default CompletionHeader;
