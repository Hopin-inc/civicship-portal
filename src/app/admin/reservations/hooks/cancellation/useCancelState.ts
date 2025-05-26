import { useState } from "react";

const DEFAULT_MESSAGE =
  "誠に恐れ入りますが、やむを得ない事情により本開催を中止させていただきます。ご迷惑をおかけしますことをお詫び申し上げます。";

export const useCancelState = (initialMessage = DEFAULT_MESSAGE) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  return {
    isSheetOpen,
    setIsSheetOpen,
    editable,
    setEditable,
    message,
    setMessage,
    DEFAULT_MESSAGE: initialMessage,
  };
};
