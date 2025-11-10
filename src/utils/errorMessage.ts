import { GqlErrorCode } from "@/types/graphql";

export const errorMessages: Record<GqlErrorCode, string> = {
  [GqlErrorCode.ValidationError]: "入力内容に誤りがあります。",
  [GqlErrorCode.Unauthenticated]: "ログインが必要です。",
  [GqlErrorCode.Forbidden]: "権限がありません。",
  [GqlErrorCode.NotFound]: "ページが見つかりません。",
  [GqlErrorCode.InternalServerError]: "サーバーエラーが発生しました。",
  [GqlErrorCode.RateLimit]: "リクエストが多すぎます。",

  [GqlErrorCode.InsufficientBalance]: "ポイント残高が不足しています。",
  [GqlErrorCode.InvalidTransferMethod]: "無効なポイント交換方法です。",
  [GqlErrorCode.MissingWalletInformation]: "ウォレット情報が不足しています。",
  [GqlErrorCode.UnsupportedTransactionReason]: "サポートされない取引理由です。",

  [GqlErrorCode.ReservationFull]: "予約枠が満員です。",
  [GqlErrorCode.AlreadyStartedReservation]: "イベントは終了しました。",
  [GqlErrorCode.ReservationCancellationTimeout]: "キャンセル期限を過ぎています。",
  [GqlErrorCode.ReservationAdvanceBookingRequired]: "開催より2日前までの予約が必要です。",
  [GqlErrorCode.ReservationNotAccepted]: "申し込みがまだ承認されていません。",
  [GqlErrorCode.SlotNotScheduled]: "予約枠は開催が予定されていません。",
  [GqlErrorCode.TicketParticipantMismatch]: "チケットと人数が一致しません。",

  [GqlErrorCode.AlreadyJoined]: "既に参加しています。",
  [GqlErrorCode.NoAvailableParticipationSlots]: "参加可能な枠がありません。",
  [GqlErrorCode.PersonalRecordOnlyDeletable]: "個人の記録のみ削除できます。",

  [GqlErrorCode.AlreadyEvaluated]: "既に評価済みです。",
  [GqlErrorCode.CannotEvaluateBeforeOpportunityStart]: "開始前は評価できません。",

  [GqlErrorCode.AlreadyUsedClaimLink]: "リンクは使用済みです。",
  [GqlErrorCode.ClaimLinkExpired]: "リンクの有効期限が切れています。",

  [GqlErrorCode.Unknown]: "予期しないエラーが発生しました。",
};
