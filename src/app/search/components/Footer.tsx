import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchFooterProps {
  onClear: () => void;
  onSearch: () => void;
}

const SearchFooter: React.FC<SearchFooterProps> = ({ onClear, onSearch }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-w-mobile-l w-full h-16 flex items-center px-4 justify-between mx-auto">
        <Button
          onClick={onClear}
          variant="link"
          className="text-label-md !text-foreground underline"
        >
          条件をクリア
        </Button>
        <Button onClick={onSearch}>
          <Search className="h-4 w-4 mr-1" />
          検索
        </Button>
    </footer>
  );
};

export default SearchFooter;
