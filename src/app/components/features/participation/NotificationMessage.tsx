'use client';

import React from 'react';
import { AlertCircle, Check } from "lucide-react";

type NotificationType = 'success' | 'error';

interface NotificationMessageProps {
  type: NotificationType;
  title: string;
  message?: string;
}

export const NotificationMessage: React.FC<NotificationMessageProps> = ({
  type,
  title,
  message,
}) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const Icon = isSuccess ? Check : AlertCircle;
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`p-3 rounded-xl border-[1px] ${bgColor} ${borderColor} mb-6`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-5 h-5 mt-[3px] ${iconColor}`} />
        <div className="flex-1">
          <p className="font-bold leading-6">{title}</p>
          {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default NotificationMessage;
