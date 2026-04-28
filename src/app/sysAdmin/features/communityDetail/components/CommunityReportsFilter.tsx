"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  GqlReportStatus,
  GqlReportVariant,
} from "@/types/graphql";
import {
  STATUS_LABELS,
  VARIANT_LABELS,
} from "@/app/sysAdmin/features/system/templates/shared/labels";

const ANY = "__any__";

export type CommunityReportsFilterValue = {
  status: GqlReportStatus | null;
  variant: GqlReportVariant | null;
  /** YYYY-MM-DD (HTML date input native format) — backend へは ISO で投げる */
  publishedAfter: string | null;
  publishedBefore: string | null;
};

export const EMPTY_FILTER: CommunityReportsFilterValue = {
  status: null,
  variant: null,
  publishedAfter: null,
  publishedBefore: null,
};

type Props = {
  value: CommunityReportsFilterValue;
  onChange: (next: CommunityReportsFilterValue) => void;
  /** 再フェッチ中は true。Select 等は disable しないが、視覚的フィードバックを
   * 出したい呼び出し側用のフラグ。 */
  loading?: boolean;
};

/**
 * コミュニティ詳細のレポート履歴を絞り込むフォーム (controlled)。
 *
 * GraphQL 側 (`GET_ADMIN_BROWSE_REPORTS`) が status / variant /
 * publishedAfter / publishedBefore を取れるようになっているので、UI から
 * 触れるようにする。日付は native `<input type="date">` で済ませている
 * (DatePicker abstraction は必要になったタイミングで切り出す)。
 */
export function CommunityReportsFilter({ value, onChange, loading }: Props) {
  const isFiltered =
    value.status !== null ||
    value.variant !== null ||
    value.publishedAfter !== null ||
    value.publishedBefore !== null;

  return (
    <div className="space-y-2 rounded border border-border bg-muted/20 p-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="space-y-1">
          <label className="text-body-xs text-muted-foreground">
            ステータス
          </label>
          <Select
            value={value.status ?? ANY}
            onValueChange={(v) =>
              onChange({
                ...value,
                status: v === ANY ? null : (v as GqlReportStatus),
              })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>すべて</SelectItem>
              {Object.entries(STATUS_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-body-xs text-muted-foreground">種類</label>
          <Select
            value={value.variant ?? ANY}
            onValueChange={(v) =>
              onChange({
                ...value,
                variant: v === ANY ? null : (v as GqlReportVariant),
              })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>すべて</SelectItem>
              {Object.entries(VARIANT_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-body-xs text-muted-foreground">公開開始</label>
          <Input
            type="date"
            value={value.publishedAfter ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                publishedAfter: e.target.value === "" ? null : e.target.value,
              })
            }
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <label className="text-body-xs text-muted-foreground">公開終了</label>
          <Input
            type="date"
            value={value.publishedBefore ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                publishedBefore: e.target.value === "" ? null : e.target.value,
              })
            }
            className="h-9"
          />
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
              onClick={() => onChange(EMPTY_FILTER)}
            >
              クリア
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
