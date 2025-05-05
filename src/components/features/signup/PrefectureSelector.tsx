

import React from 'react';
import { Button } from '@/components/ui/button';
import { GqlCurrentPrefecture } from '@/types/graphql';
import { prefectureLabels, prefectureOptions } from '@/hooks/features/user/useSignUp';

interface PrefectureSelectorProps {
  value: GqlCurrentPrefecture | undefined;
  onChange: (prefecture: GqlCurrentPrefecture) => void;
  error?: string;
}

/**
 * Component for selecting prefecture in the sign-up form
 */
export const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {prefectureOptions.map((prefecture: GqlCurrentPrefecture) => (
          <Button
            key={prefecture}
            type="button"
            variant="secondary"
            className={`h-12 rounded-2xl border-2 ${
              value === prefecture
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onChange(prefecture)}
          >
            {prefectureLabels[prefecture]}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        className={`w-full h-12 rounded-2xl border-2 ${
          value === GqlCurrentPrefecture.OutsideShikoku
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={() => onChange(GqlCurrentPrefecture.OutsideShikoku)}
      >
        {prefectureLabels[GqlCurrentPrefecture.OutsideShikoku]}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default PrefectureSelector;
