import {
  GqlReportFeedbackType,
  GqlReportStatus,
  GqlReportTemplateKind,
  GqlReportTemplateScope,
  GqlReportVariant,
} from "@/types/graphql";

/** variant の日本語表示名。Phase 1 では PERSONAL_RECAP を扱わないが、API 上存在するので label は用意。 */
export const VARIANT_LABELS: Record<GqlReportVariant, string> = {
  [GqlReportVariant.MemberNewsletter]: "メンバーニュースレター",
  [GqlReportVariant.WeeklySummary]: "週次サマリー",
  [GqlReportVariant.GrantApplication]: "助成金申請",
  [GqlReportVariant.MediaPr]: "メディア PR",
  [GqlReportVariant.PersonalRecap]: "個人レキャップ",
};

export function variantLabel(variant: GqlReportVariant): string {
  return VARIANT_LABELS[variant] ?? variant;
}

export const STATUS_LABELS: Record<GqlReportStatus, string> = {
  [GqlReportStatus.Draft]: "下書き",
  [GqlReportStatus.Approved]: "承認済み",
  [GqlReportStatus.Published]: "公開済み",
  [GqlReportStatus.Rejected]: "却下",
  [GqlReportStatus.Skipped]: "スキップ",
  [GqlReportStatus.Superseded]: "置き換え済み",
};

export function statusLabel(status: GqlReportStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export const SCOPE_LABELS: Record<GqlReportTemplateScope, string> = {
  [GqlReportTemplateScope.System]: "全コミュニティ共通",
  [GqlReportTemplateScope.Community]: "コミュニティ別",
};

export function scopeLabel(scope: GqlReportTemplateScope): string {
  return SCOPE_LABELS[scope] ?? scope;
}

export const FEEDBACK_TYPE_LABELS: Record<GqlReportFeedbackType, string> = {
  [GqlReportFeedbackType.Quality]: "品質",
  [GqlReportFeedbackType.Accuracy]: "精度",
  [GqlReportFeedbackType.Tone]: "トーン",
  [GqlReportFeedbackType.Structure]: "構成",
  [GqlReportFeedbackType.Other]: "その他",
};

export function feedbackTypeLabel(type: GqlReportFeedbackType): string {
  return FEEDBACK_TYPE_LABELS[type] ?? type;
}

/**
 * テンプレートの種別 (生成用 / 評価用) の日本語表示名。
 * 文字列は既存タブ文言 ("生成用" / "評価用") に揃える (UI 文言を変えずに
 * enum→ラベル関数化のみ行う方針)。
 */
export const KIND_LABELS: Record<GqlReportTemplateKind, string> = {
  [GqlReportTemplateKind.Generation]: "生成用",
  [GqlReportTemplateKind.Judge]: "評価用",
};

export function kindLabel(kind: GqlReportTemplateKind): string {
  return KIND_LABELS[kind] ?? kind;
}
