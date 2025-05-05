

import React from 'react';

interface SearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

/**
 * Search input form component
 */
export const SearchForm: React.FC<SearchFormProps> = ({ 
  searchQuery, 
  onSearchQueryChange 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="検索ワードを入力"
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white outline-none text-base placeholder:text-gray-400"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
