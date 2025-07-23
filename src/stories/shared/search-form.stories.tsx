import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import SearchForm from "@/components/shared/SearchForm";

const meta: Meta<typeof SearchForm> = {
  title: "Shared/Components/SearchForm",
  component: SearchForm,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Current search value",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    onInputChange: {
      action: "input changed",
      description: "Callback when input value changes",
    },
    onSearch: {
      action: "search triggered",
      description: "Callback when search is triggered (Enter key or blur)",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {
  args: {
    value: "",
    placeholder: "検索してください",
    onInputChange: () => {},
    onSearch: () => {},
  },
};

export const WithValue: Story = {
  args: {
    value: "サンプル検索",
    placeholder: "検索してください",
    onInputChange: () => {},
    onSearch: () => {},
  },
};

// Temporarily commented out due to React Hooks in render function ESLint error
// export const Interactive: Story = {
//   render: () => {
//     const [value, setValue] = useState("");
//     const [searchHistory, setSearchHistory] = useState<string[]>([]);

//     const handleSearch = (searchValue: string) => {
//       if (searchValue.trim()) {
//         setSearchHistory(prev => [searchValue, ...prev.slice(0, 4)]);
//       }
//     };

//     return (
//       <div className="space-y-4">
//         <SearchForm
//           value={value}
//           onInputChange={setValue}
//           onSearch={handleSearch}
//           placeholder="アクティビティを検索"
//         />
//         {searchHistory.length > 0 && (
//           <div className="mt-4">
//             <p className="text-sm font-medium mb-2">検索履歴:</p>
//             <ul className="text-sm text-muted-foreground space-y-1">
//               {searchHistory.map((term, index) => (
//                 <li key={index}>• {term}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     );
//   },
// };

export const DifferentPlaceholders: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">アクティビティ検索:</p>
        <SearchForm
          value=""
          onInputChange={() => {}}
          onSearch={() => {}}
          placeholder="アクティビティを検索"
        />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">場所検索:</p>
        <SearchForm
          value=""
          onInputChange={() => {}}
          onSearch={() => {}}
          placeholder="場所を検索"
        />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">ユーザー検索:</p>
        <SearchForm
          value=""
          onInputChange={() => {}}
          onSearch={() => {}}
          placeholder="ユーザー名を検索"
        />
      </div>
    </div>
  ),
};
