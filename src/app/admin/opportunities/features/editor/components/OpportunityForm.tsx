import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { GqlPublishStatus, GqlOpportunityCategory } from "@/types/graphql";
import { ContentSection } from "./sections/ContentSection";
import { SettingsSection } from "./sections/SettingsSection";
import { CategorySettingsSection } from "./sections/CategorySettingsSection";
import { OperationSection } from "./sections/OperationSection";
import { ImageData, ValidationErrors } from "../types/form";
import { SlotData } from "../../shared/types/slot";

// グループ化された props 型定義
export interface ContentProps {
  title: string;
  onTitleChange: (value: string) => void;
  summary: string;
  onSummaryChange: (value: string) => void;
  description: string;
  onDescriptionClick: () => void;
  images: ImageData[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  slots: SlotData[];
  onSlotsClick: () => void;
}

export interface SettingsProps {
  selectedHostName: string | null;
  onHostClick: () => void;
  selectedPlaceName: string | null;
  onPlaceClick: () => void;
  capacity: number;
  onCapacityChange: (value: number) => void;
}

export interface CategoryProps {
  mode: "create" | "update";
  category: GqlOpportunityCategory;
  onCategoryChange: (value: GqlOpportunityCategory) => void;
  feeRequired: number;
  onFeeRequiredChange: (value: number) => void;
  pointsRequired: number;
  onPointsRequiredChange: (value: number) => void;
  pointsToEarn: number;
  onPointsToEarnChange: (value: number) => void;
}

export interface OperationProps {
  requireHostApproval: boolean;
  onRequireHostApprovalChange: (value: boolean) => void;
  publishStatus: GqlPublishStatus;
  onPublishStatusChange: (value: string) => void;
}

interface OpportunityFormProps {
  mode: "create" | "update";
  saving: boolean;
  onSubmit: (e: FormEvent) => void;
  content: ContentProps;
  settings: SettingsProps;
  category: CategoryProps;
  operation: OperationProps;
  errors: ValidationErrors;
}

export function OpportunityForm({
  mode,
  saving,
  onSubmit,
  content,
  settings,
  category,
  operation,
  errors,
}: OpportunityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* === セクション1: コンテンツ === */}
      <ContentSection
        {...content}
        errors={errors}
      />

      {/* === セクション2: 設定 === */}
      <SettingsSection
        {...settings}
        errors={errors}
      />

      {/* === セクション3: カテゴリ・料金設定 === */}
      <CategorySettingsSection {...category} />

      {/* === セクション4: 運用・公開設定 === */}
      <OperationSection {...operation} />

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={saving}
        >
          {saving ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </div>
    </form>
  );
}
