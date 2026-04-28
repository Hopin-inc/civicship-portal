"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GqlReportFeedbackType } from "@/types/graphql";
import { FEEDBACK_TYPE_LABELS } from "@/app/sysAdmin/features/system/templates/shared/labels";

const ANY = "__any__";

export type TemplateFeedbacksFilterValue = {
  feedbackType: GqlReportFeedbackType | null;
  maxRating: number | null;
};

export const EMPTY_FEEDBACKS_FILTER: TemplateFeedbacksFilterValue = {
  feedbackType: null,
  maxRating: null,
};

type Props = {
  value: TemplateFeedbacksFilterValue;
  onChange: (next: TemplateFeedbacksFilterValue) => void;
  loading?: boolean;
};

/**
 * テンプレ詳細のフィードバック一覧を絞り込むフォーム (controlled)。
 *
 * GraphQL 側 (`GET_ADMIN_TEMPLATE_FEEDBACKS`) が `feedbackType` / `maxRating`
 * を取れるので、UI から触れるようにする。`maxRating` は「N 以下のみ表示」
 * (低評価の問題分析用)。stats 側はあえてフィルタを掛けない方針なので、
 * 件数表示と分布は母集団のまま。
 */
export function TemplateFeedbacksFilter({ value, onChange, loading }: Props) {
  const isFiltered = value.feedbackType !== null || value.maxRating !== null;

  return (
    <div className="space-y-2 rounded border border-border bg-muted/20 p-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-body-xs text-muted-foreground">種類</label>
          <Select
            value={value.feedbackType ?? ANY}
            onValueChange={(v) =>
              onChange({
                ...value,
                feedbackType:
                  v === ANY ? null : (v as GqlReportFeedbackType),
              })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>すべて</SelectItem>
              {Object.entries(FEEDBACK_TYPE_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-body-xs text-muted-foreground">
            評価上限
          </label>
          <Select
            value={value.maxRating == null ? ANY : String(value.maxRating)}
            onValueChange={(v) =>
              onChange({
                ...value,
                maxRating: v === ANY ? null : Number(v),
              })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="指定なし" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>指定なし</SelectItem>
              <SelectItem value="1">★1 以下</SelectItem>
              <SelectItem value="2">★2 以下</SelectItem>
              <SelectItem value="3">★3 以下</SelectItem>
              <SelectItem value="4">★4 以下</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(isFiltered || loading) && (
        <div className="flex items-center justify-between">
          <span className="text-body-xs text-muted-foreground">
            {loading ? "再読み込み中..." : ""}
          </span>
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(EMPTY_FEEDBACKS_FILTER)}
            >
              クリア
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
