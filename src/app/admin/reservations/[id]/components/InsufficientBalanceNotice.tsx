import { NoticeCard } from "@/components/shared/NoticeCard";

type Props = {
  mode?: "approval" | "attendance" | "cancellation" | null;
  isApplied?: boolean;
  isInsufficientBalanceForApproval?: boolean;
  isInsufficientBalanceForAttendance?: boolean;
  requiredPointsForApproval: number;
  requiredPointsForAttendance: number;
  organizerBalance: number | bigint;
};

export const InsufficientBalanceNotice: React.FC<Props> = ({
  mode,
  isApplied,
  isInsufficientBalanceForApproval,
  isInsufficientBalanceForAttendance,
  requiredPointsForApproval,
  requiredPointsForAttendance,
  organizerBalance,
}) => {
  const balanceText = organizerBalance.toString();

  const isApprovalVisible = mode === "approval" && isApplied && isInsufficientBalanceForApproval;
  const isAttendanceVisible = mode === "attendance" && isInsufficientBalanceForAttendance;

  if (!isApprovalVisible && !isAttendanceVisible) return null;

  const description =
    mode === "approval"
      ? `承認には ${requiredPointsForApproval}pt が必要ですが、現在の残高は ${balanceText}pt です。残高が不足しているため、承認後に報酬支払いが行えない場合があります。`
      : `出席者への報酬支払いには ${requiredPointsForAttendance}pt が必要ですが、現在の残高は ${balanceText}pt です。管理者にポイントの支給を依頼するか、お手伝いに参加してポイントを獲得してください。`;

  const marginClass = mode === "approval" ? "mb-8" : "mt-4";

  return (
    <div className={marginClass}>
      <NoticeCard title="ポイント残高が不足しています" description={description} />
    </div>
  );
};
