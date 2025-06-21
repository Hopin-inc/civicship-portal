"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SelectionContextType = {
  selectedTicketId: string | null;
  selectedDate: string | null;
  selectedUsers: string[];
  setSelectedTicketId: (id: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedUsers: (users: string[]) => void;
  resetSelection: () => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const resetSelection = () => {
    setSelectedTicketId(null);
    setSelectedDate(null);
    setSelectedUsers([]);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedTicketId,
        selectedDate,
        selectedUsers,
        setSelectedTicketId,
        setSelectedDate,
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