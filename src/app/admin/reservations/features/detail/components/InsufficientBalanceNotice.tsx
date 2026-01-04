import { NoticeCard } from "@/components/shared/NoticeCard";
import { GqlOpportunity, GqlOpportunityCategory } from "@/types/graphql";

type Props = {
  mode?: "approval" | "attendance" | "cancellation" | null;
  isApplied?: boolean;
  isInsufficientBalanceForApproval?: boolean;
  isInsufficientBalanceForAttendance?: boolean;
  requiredPointsForApproval: number;
  requiredPointsForAttendance: number;
  organizerBalance: number | bigint;
  showAttendanceInfo?: boolean;
  opportunity?: GqlOpportunity | null;
};

export const InsufficientBalanceNotice: React.FC<Props> = ({
  mode,
  isApplied,
  isInsufficientBalanceForApproval,
  isInsufficientBalanceForAttendance,
  requiredPointsForApproval,
  requiredPointsForAttendance,
  organizerBalance,
  showAttendanceInfo = false,
  opportunity,
}) => {
  const balanceText = organizerBalance.toString();

  const isApprovalVisible = mode === "approval" && isApplied && isInsufficientBalanceForApproval;
  const isAttendanceVisible = mode === "attendance" && isInsufficientBalanceForAttendance;
  const isAttendanceInfoVisible = mode === "attendance" && showAttendanceInfo && opportunity;

  // バランス不足の警告
  if (isApprovalVisible || isAttendanceVisible) {
    const description =
      mode === "approval"
        ? `承認には ${requiredPointsForApproval}pt が必要ですが、現在の残高は ${balanceText}pt です。残高が不足しているため、承認後に報酬支払いが行えない場合があります。`
        : `出席者への報酬支払いには ${requiredPointsForAttendance}pt が必要ですが、現在の残高は ${balanceText}pt です。管理者にポイントの支給を依頼するか、お手伝いに参加してポイントを獲得してください。`;

    const marginClass = mode === "approval" ? "mb-8" : "mt-4 mb-4";

    return (
      <div className={marginClass}>
        <NoticeCard title="ポイント残高が不足しています" description={description} />
      </div>
    );
  }

  // 出欠情報の案内
  if (isAttendanceInfoVisible) {
    const description =
      opportunity.category === GqlOpportunityCategory.Quest
        ? `参加した方には証明書(VC)が発行され、1人につき${opportunity.pointsToEarn || 0}ptが付与されます。改めて編集することはできません。`
        : "参加した方には証明書(VC)が発行され、改めて編集することはできません。";

    return (
      <div className="mt-4 mb-4">
        <NoticeCard title="保存後の処理について" description={description} variant="info" />
      </div>
    );
  }

  return null;
};
