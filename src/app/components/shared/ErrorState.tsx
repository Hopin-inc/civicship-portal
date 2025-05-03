import React from 'react';

interface ErrorStateProps {
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'エラーが発生しました' }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
