"use client";

import { FormEvent, useState, useCallback, useMemo } from "react";
import { GqlPublishStatus } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useOpportunityEditor } from "../hooks/useOpportunityEditor";
import { useFormSheets } from "../hooks/useFormSheets";
import { OpportunityFormData, FormEditMode } from "../types/form";
import { EditSlotsPage } from "../../slots/components/EditSlotsPage";
import { OpportunityForm } from "./OpportunityForm";
import { OpportunityFormSheets } from "./OpportunityFormSheets";

interface OpportunityFormEditorProps {
  mode: "create" | "update";
  opportunityId?: string;
  initialData?: Partial<OpportunityFormData>;
  onSuccess?: (id?: string) => void;
}

export const OpportunityFormEditor = ({
  mode,
  opportunityId,
  initialData,
  onSuccess,
}: OpportunityFormEditorProps) => {
  const [editMode, setEditMode] = useState<FormEditMode>('form');
  const editor = useOpportunityEditor({ mode, opportunityId, initialData });
  const sheets = useFormSheets();
  const [selectedHostName, setSelectedHostName] = useState<string | null>(
    initialData?.hostName || null
  );
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(
    initialData?.placeName || null
  );

  // ヘッダー設定（formモード時のみ）
  const headerConfig = useMemo(
    () => editMode === 'form' ? ({
      title: mode === "create" ? "募集作成" : "募集編集",
      showLogo: false,
      showBackButton: true,
      hideFooter: true,
    }) : undefined,
    [mode, editMode],
  );
  useHeaderConfig(headerConfig);

  const handleHostSelect = (hostId: string, hostName: string) => {
    editor.setHostUserId(hostId);
    setSelectedHostName(hostName);
  };

  const handlePlaceSelect = (placeId: string, placeName: string) => {
    editor.setPlaceId(placeId);
    setSelectedPlaceName(placeName);
  };

  const handlePublishStatusChange = useCallback(
    (value: string) => {
      editor.setPublishStatus(value as GqlPublishStatus);
    },
    [editor]
  );

  const handleSubmit = async (e: FormEvent) => {
    const resultId = await editor.handleSave(e);
    if (resultId) {
      onSuccess?.(resultId);
    }
  };

  // モード切り替えハンドラー
  const enterSlotsMode = useCallback(() => setEditMode('slots'), []);
  const exitSlotsMode = useCallback(() => setEditMode('form'), []);

  // 開催枠編集モードの場合は EditSlotsPage のみ表示
  if (editMode === 'slots') {
    return (
      <EditSlotsPage
        slots={editor.slots}
        onAddSlotsBatch={editor.addSlotsBatch}
        onUpdateSlot={editor.updateSlot}
        onRemoveSlot={editor.removeSlot}
        onCancelSlot={editor.cancelSlot}
        onClose={exitSlotsMode}
      />
    );
  }

  return (
    <>
      <OpportunityForm
        mode={mode}
        editor={editor}
        onSubmit={handleSubmit}
        onDescriptionClick={() => sheets.descriptionSheet.setOpen(true)}
        onSlotsClick={enterSlotsMode}
        onHostClick={() => sheets.hostSheet.setOpen(true)}
        onPlaceClick={() => sheets.placeSheet.setOpen(true)}
        selectedHostName={selectedHostName}
        selectedPlaceName={selectedPlaceName}
        onPublishStatusChange={handlePublishStatusChange}
      />

      <OpportunityFormSheets
        descriptionSheetOpen={sheets.descriptionSheet.open}
        onDescriptionSheetChange={sheets.descriptionSheet.setOpen}
        description={editor.description}
        onDescriptionChange={editor.setDescription}
        hostSheetOpen={sheets.hostSheet.open}
        onHostSheetChange={sheets.hostSheet.setOpen}
        selectedHostId={editor.hostUserId}
        onSelectHost={handleHostSelect}
        placeSheetOpen={sheets.placeSheet.open}
        onPlaceSheetChange={sheets.placeSheet.setOpen}
        selectedPlaceId={editor.placeId}
        onSelectPlace={handlePlaceSelect}
      />
    </>
  );
};
