import React from 'react';

interface ArticleLoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'h-6 w-6 border-b-1',
  medium: 'h-8 w-8 border-b-2',
  large: 'h-10 w-10 border-b-2',
};

export const ArticleLoadingIndicator: React.FC<ArticleLoadingIndicatorProps> = ({ 
  size = 'medium' 
}) => {
  return (
    <div className="flex justify-center p-4">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-foreground`}></div>
    </div>
  );
};

export default ArticleLoadingIndicator;
