import { EditDescriptionSheet } from "./sheets/EditDescriptionSheet";
import { HostSelectorSheet } from "./sheets/HostSelectorSheet";
import { PlaceSelectorSheet } from "./sheets/PlaceSelectorSheet";

interface OpportunityFormSheetsProps {
  // Description sheet
  descriptionSheetOpen: boolean;
  onDescriptionSheetChange: (open: boolean) => void;
  description: string;
  onDescriptionChange: (value: string) => void;

  // Host sheet
  hostSheetOpen: boolean;
  onHostSheetChange: (open: boolean) => void;
  selectedHostId: string;
  onSelectHost: (hostId: string, hostName: string) => void;

  // Place sheet
  placeSheetOpen: boolean;
  onPlaceSheetChange: (open: boolean) => void;
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string, placeName: string) => void;
}

export function OpportunityFormSheets({
  descriptionSheetOpen,
  onDescriptionSheetChange,
  description,
  onDescriptionChange,
  hostSheetOpen,
  onHostSheetChange,
  selectedHostId,
  onSelectHost,
  placeSheetOpen,
  onPlaceSheetChange,
  selectedPlaceId,
  onSelectPlace,
}: OpportunityFormSheetsProps) {
  return (
    <>
      <EditDescriptionSheet
        open={descriptionSheetOpen}
        onOpenChange={onDescriptionSheetChange}
        value={description}
        onChange={onDescriptionChange}
      />

      <HostSelectorSheet
        open={hostSheetOpen}
        onOpenChange={onHostSheetChange}
        selectedHostId={selectedHostId}
        onSelectHost={onSelectHost}
      />

      <PlaceSelectorSheet
        open={placeSheetOpen}
        onOpenChange={onPlaceSheetChange}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={onSelectPlace}
      />
    </>
  );
}
