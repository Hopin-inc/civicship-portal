import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ContentSection } from "./sections/ContentSection";
import { SettingsSection } from "./sections/SettingsSection";
import { CategorySettingsSection } from "./sections/CategorySettingsSection";
import { OperationSection } from "./sections/OperationSection";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";

interface OpportunityFormProps {
  mode: "create" | "update";
  editor: ReturnType<typeof useOpportunityEditor>;
  onSubmit: (e: FormEvent) => void;
  onDescriptionClick: () => void;
  onSlotsClick: () => void;
  onHostClick: () => void;
  onPlaceClick: () => void;
  selectedHostName: string | null;
  selectedPlaceName: string | null;
  onPublishStatusChange: (value: string) => void;
}

export function OpportunityForm({
  mode,
  editor,
  onSubmit,
  onDescriptionClick,
  onSlotsClick,
  onHostClick,
  onPlaceClick,
  selectedHostName,
  selectedPlaceName,
  onPublishStatusChange,
}: OpportunityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* === セクション1: コンテンツ === */}
      <ContentSection
        title={editor.title}
        onTitleChange={editor.setTitle}
        summary={editor.summary}
        onSummaryChange={editor.setSummary}
        description={editor.description}
        onDescriptionClick={onDescriptionClick}
        images={editor.images}
        onImageSelect={editor.handleImageSelect}
        onRemoveImage={editor.removeImage}
        slots={editor.slots}
        onSlotsClick={onSlotsClick}
        errors={editor.errors}
      />

      {/* === セクション2: 設定 === */}
      <SettingsSection
        selectedHostName={selectedHostName}
        onHostClick={onHostClick}
        selectedPlaceName={selectedPlaceName}
        onPlaceClick={onPlaceClick}
        capacity={editor.capacity}
        onCapacityChange={editor.setCapacity}
        errors={editor.errors}
      />

      {/* === セクション3: カテゴリ・料金設定 === */}
      <CategorySettingsSection
        mode={mode}
        category={editor.category}
        onCategoryChange={editor.setCategory}
        feeRequired={editor.feeRequired}
        onFeeRequiredChange={editor.setFeeRequired}
        pointsRequired={editor.pointsRequired}
        onPointsRequiredChange={editor.setPointsRequired}
        pointsToEarn={editor.pointsToEarn}
        onPointsToEarnChange={editor.setPointsToEarn}
      />

      {/* === セクション4: 運用・公開設定 === */}
      <OperationSection
        requireHostApproval={editor.requireHostApproval}
        onRequireHostApprovalChange={editor.setRequireHostApproval}
        publishStatus={editor.publishStatus}
        onPublishStatusChange={onPublishStatusChange}
      />

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={editor.saving}
        >
          {editor.saving ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </div>
    </form>
  );
}
