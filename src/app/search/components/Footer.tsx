import React from "react";
import { Button } from "@/components/ui/button";

interface SearchFooterProps {
  onClear: () => void;
  onSearch: () => void;
}

const SearchFooter: React.FC<SearchFooterProps> = ({ onClear, onSearch }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-10">
      <div className="max-w-lg mx-auto px-4 h-16 flex justify-between items-center">
        <Button onClick={onClear} variant="link">
          条件をクリア
        </Button>
        <Button onClick={onSearch}>検索</Button>
      </div>
    </footer>
  );
};

export default SearchFooter;
