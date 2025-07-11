"use client";

import { GqlParticipationStatusReason } from "@/types/graphql";
import { createContext, useContext, useState, ReactNode } from "react";

type ParticipatedUser = {
  userId: string;
  slotId: string;
  reason: GqlParticipationStatusReason | undefined;
  isCreatedByUser: boolean;
};

type SelectionContextType = {
  selectedSlot: { opportunityId: string; slotId: string; userIds: string[] } | null;
  selectedUsers: string[];
  setSelectedSlot: React.Dispatch<React.SetStateAction<{ opportunityId: string; slotId: string; userIds: string[] } | null>>;
  setSelectedUsers: (users: string[]) => void;
  resetSelection: () => void;
  participatedUsers: ParticipatedUser[];
  setParticipatedUsers: React.Dispatch<React.SetStateAction<ParticipatedUser[]>>;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedSlot, setSelectedSlot] = useState<{ opportunityId: string; slotId: string; userIds: string[] } | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [participatedUsers, setParticipatedUsers] = useState<ParticipatedUser[]>([]);
  const resetSelection = () => {
    setSelectedSlot(null);
    setSelectedUsers([]);
    setParticipatedUsers([]);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedSlot,
        selectedUsers,
        setSelectedSlot,
        setSelectedUsers,
        resetSelection,
        participatedUsers,
        setParticipatedUsers,
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