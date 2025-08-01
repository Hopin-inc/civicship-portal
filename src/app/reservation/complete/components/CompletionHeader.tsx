"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

/**
 * Header component for the reservation completion page
 */
interface CompletionHeaderProps {
  requireApproval: boolean | undefined;
}

const getApprovalText = (requireApproval: boolean | undefined) => {
  if (requireApproval === true) {
    return {
      title: "申し込み完了",
      description: (
        <>
          <span className="font-bold">案内人が承認すると、予約が確定します｡</span>
          <br />
          <span className="text-body-sm">予約確定時にはLINEにてお知らせします｡</span>
        </>
      )
    };
  }
  if (requireApproval === false) {
    return {
      title: "予約完了",
      description: (
        <>
          承認なしで参加できる募集のため、予約が確定しました。
          <br />
          キャンセルをご希望の際は、マイページよりお手続きいただけます。
        </>
      )
    };
  }
  return {
    title: "案内人による承認が必要です",
    description: (
      <>
        <strong>案内人が承認すると、予約が確定します｡</strong>
        <br />
        予約確定時にはLINEにてお知らせします｡
      </>
    )
  };
};

const CompletionHeader: React.FC<CompletionHeaderProps> = ({ requireApproval }) => {
  const approvalText = getApprovalText(requireApproval);
  return (
    <div className="flex flex-col items-center pt-10 pb-6 max-w-mobile-l mx-auto w-full gap-y-2 px-6">
      <div className="flex items-center justify-center">
        <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="text-display-md">{ approvalText.title }</h2>
      <p className="text-body-md text-caption text-center">
        { approvalText.description }
      </p>
    </div>
  );
};

export default CompletionHeader;
