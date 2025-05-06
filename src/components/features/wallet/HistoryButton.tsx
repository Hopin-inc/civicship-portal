
import React from 'react';
import { Button } from "@/components/ui/button";

interface HistoryButtonProps {
  onClick: () => void;
}

export const HistoryButton: React.FC<HistoryButtonProps> = ({
  onClick
}) => {
  return (
    <div className="flex justify-center mb-10">
      <Button 
        onClick={onClick}
        variant="tertiary"
        className="w-[104px] h-[48px] bg-white border border-gray-200"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="text-base">履歴</span>
      </Button>
    </div>
  );
};

export default HistoryButton;
