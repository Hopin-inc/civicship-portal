import { ErrorCard, PendingCard } from "../components/StatusCard";
import { VCIssuanceStatus } from "../types";

export const renderStatusCard = (status: string) => {
    switch (status) {
      case VCIssuanceStatus.PENDING:
        return <PendingCard />;
      case VCIssuanceStatus.FAILED:
        return <ErrorCard />;
      default:
        return <div></div>;
    }
  }

  export const statusStyle: Record<VCIssuanceStatus, { label: string; className: string }> = {
    [VCIssuanceStatus.PENDING]: {
      label: "発行中",
      className: "bg-[#FEF9C3] text-[#A16207]",
    },
    [VCIssuanceStatus.FAILED]: {
      label: "発行失敗",
      className: "bg-[#FEE2E2] text-[#B91C1C]",
    },
    [VCIssuanceStatus.COMPLETED]: {
      label: "発行済み",
      className: "bg-[#DBEAFE] text-[#1D4ED8]",
    },
  };