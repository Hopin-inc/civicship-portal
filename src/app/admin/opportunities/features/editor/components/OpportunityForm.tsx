import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { GqlPublishStatus } from "@/types/graphql";
import { ContentSection } from "./sections/ContentSection";
import { SettingsSection } from "./sections/SettingsSection";
import { CategorySettingsSection } from "./sections/CategorySettingsSection";
import { OperationSection } from "./sections/OperationSection";
import { ImageData } from "../types/form";
import { SlotData } from "../../shared/types/slot";
import { ValidationErrors } from "../types/form";
import { GqlOpportunityCategory } from "@/types/graphql";

interface OpportunityFormProps {
  mode: "create" | "update";
  saving: boolean;
  onSubmit: (e: FormEvent) => void;

  // Content
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

  // Settings
  selectedHostName: string | null;
  onHostClick: () => void;
  selectedPlaceName: string | null;
  onPlaceClick: () => void;
  capacity: number;
  onCapacityChange: (value: number) => void;

  // Category
  category: GqlOpportunityCategory;
  onCategoryChange: (value: GqlOpportunityCategory) => void;
  feeRequired: number;
  onFeeRequiredChange: (value: number) => void;
  pointsRequired: number;
  onPointsRequiredChange: (value: number) => void;
  pointsToEarn: number;
  onPointsToEarnChange: (value: number) => void;

  // Operation
  requireHostApproval: boolean;
  onRequireHostApprovalChange: (value: boolean) => void;
  publishStatus: GqlPublishStatus;
  onPublishStatusChange: (value: string) => void;

  // Validation
  errors: ValidationErrors;
}

export function OpportunityForm({
  mode,
  saving,
  onSubmit,
  title,
  onTitleChange,
  summary,
  onSummaryChange,
  description,
  onDescriptionClick,
  images,
  onImageSelect,
  onRemoveImage,
  slots,
  onSlotsClick,
  selectedHostName,
  onHostClick,
  selectedPlaceName,
  onPlaceClick,
  capacity,
  onCapacityChange,
  category,
  onCategoryChange,
  feeRequired,
  onFeeRequiredChange,
  pointsRequired,
  onPointsRequiredChange,
  pointsToEarn,
  onPointsToEarnChange,
  requireHostApproval,
  onRequireHostApprovalChange,
  publishStatus,
  onPublishStatusChange,
  errors,
}: OpportunityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* === セクション1: コンテンツ（タイトル〜開催枠） === */}
      <ContentSection
        title={title}
        onTitleChange={onTitleChange}
        summary={summary}
        onSummaryChange={onSummaryChange}
        description={description}
        onDescriptionClick={onDescriptionClick}
        images={images}
        onImageSelect={onImageSelect}
        onRemoveImage={onRemoveImage}
        slots={slots}
        onSlotsClick={onSlotsClick}
        errors={errors}
      />

      {/* === セクション2: 設定 === */}
      <SettingsSection
        selectedHostName={selectedHostName}
        onHostClick={onHostClick}
        selectedPlaceName={selectedPlaceName}
        onPlaceClick={onPlaceClick}
        capacity={capacity}
        onCapacityChange={onCapacityChange}
        errors={errors}
      />

      {/* === セクション3: カテゴリ・料金設定 === */}
      <CategorySettingsSection
        mode={mode}
        category={category}
        onCategoryChange={onCategoryChange}
        feeRequired={feeRequired}
        onFeeRequiredChange={onFeeRequiredChange}
        pointsRequired={pointsRequired}
        onPointsRequiredChange={onPointsRequiredChange}
        pointsToEarn={pointsToEarn}
        onPointsToEarnChange={onPointsToEarnChange}
      />

      {/* === セクション4: 運用・公開設定 === */}
      <OperationSection
        requireHostApproval={requireHostApproval}
        onRequireHostApprovalChange={onRequireHostApprovalChange}
        publishStatus={publishStatus}
        onPublishStatusChange={onPublishStatusChange}
      />

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
