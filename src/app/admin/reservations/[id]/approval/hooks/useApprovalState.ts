import { useState } from "react";

const DEFAULT_MESSAGE =
  "今回は日程や運営の都合により、申込をお受けできかねる結果となりました。またの機会がございましたら、ぜひご参加をご検討いただけますと幸いです。";

export const useApprovalState = (initialMessage = DEFAULT_MESSAGE) => {
  const [isAcceptSheetOpen, setIsAcceptSheetOpen] = useState(false);
  const [isRejectSheetOpen, setIsRejectSheetOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  return {
    isAcceptSheetOpen,
    setIsAcceptSheetOpen,
    isRejectSheetOpen,
    setIsRejectSheetOpen,
    editable,
    setEditable,
    message,
    setMessage,
    DEFAULT_MESSAGE: initialMessage,
  };
};
