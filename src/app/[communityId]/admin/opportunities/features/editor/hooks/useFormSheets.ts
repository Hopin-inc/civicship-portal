import { useState } from "react";

export function useFormSheets() {
  const [descriptionSheetOpen, setDescriptionSheetOpen] = useState(false);
  const [slotsSheetOpen, setSlotsSheetOpen] = useState(false);
  const [hostSheetOpen, setHostSheetOpen] = useState(false);
  const [placeSheetOpen, setPlaceSheetOpen] = useState(false);

  return {
    descriptionSheet: {
      open: descriptionSheetOpen,
      setOpen: setDescriptionSheetOpen,
    },
    slotsSheet: {
      open: slotsSheetOpen,
      setOpen: setSlotsSheetOpen,
    },
    hostSheet: {
      open: hostSheetOpen,
      setOpen: setHostSheetOpen,
    },
    placeSheet: {
      open: placeSheetOpen,
      setOpen: setPlaceSheetOpen,
    },
  };
}
