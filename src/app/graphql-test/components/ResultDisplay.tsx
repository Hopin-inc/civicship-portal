"use client";

import React from "react";

interface ResultDisplayProps {
  result: any;
  isLoading: boolean;
  error: Error | null;
}

export default function ResultDisplay({ result, isLoading, error }: ResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-300 bg-red-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-gray-500">クエリを実行すると、結果がここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2">Result</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
