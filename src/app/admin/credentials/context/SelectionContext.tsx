"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SelectionContextType = {
  selectedTicketIds: string[];
  selectedSlots: { opportunityId: string; slotId: string; userIds: string[] }[];
  selectedUsers: string[];
  setSelectedTicketIds: (ids: string[]) => void;
  setSelectedSlots: React.Dispatch<React.SetStateAction<{ opportunityId: string; slotId: string; userIds: string[] }[]>>;
  setSelectedUsers: (users: string[]) => void;
  resetSelection: () => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<{ opportunityId: string; slotId: string; userIds: string[] }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const resetSelection = () => {
    setSelectedTicketIds([]);
    setSelectedSlots([]);
    setSelectedUsers([]);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedTicketIds,
        selectedSlots,
        selectedUsers,
        setSelectedTicketIds,
        setSelectedSlots,
        setSelectedUsers,
        resetSelection,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
} 