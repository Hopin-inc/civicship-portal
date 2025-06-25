"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SelectionContextType = {
  selectedTicketId: string | null;
  selectedSlot: { opportunityId: string; slotId: string; userIds: string[] } | null;
  selectedUsers: string[];
  setSelectedTicketId: (id: string | null) => void;
  setSelectedSlot: React.Dispatch<React.SetStateAction<{ opportunityId: string; slotId: string; userIds: string[] } | null>>;
  setSelectedUsers: (users: string[]) => void;
  resetSelection: () => void;
  participatedUserIds: string[];
  setParticipatedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  participatedSlotIds: string;
  setParticipatedSlotIds: React.Dispatch<React.SetStateAction<string>>;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ opportunityId: string; slotId: string; userIds: string[] } | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [participatedUserIds, setParticipatedUserIds] = useState<string[]>([]);
  const [participatedSlotIds, setParticipatedSlotIds] = useState<string>("");
  const resetSelection = () => {
    setSelectedTicketId(null);
    setSelectedSlot(null);
    setSelectedUsers([]);
    setParticipatedUserIds([]);
    setParticipatedSlotIds("");
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedTicketId,
        selectedSlot,
        selectedUsers,
        setSelectedTicketId,
        setSelectedSlot,
        setSelectedUsers,
        resetSelection,
        participatedUserIds,
        setParticipatedUserIds,
        participatedSlotIds,
        setParticipatedSlotIds,
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