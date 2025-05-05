'use client';

import React from 'react';

interface TicketDetailRequestsProps {
  requests: string[];
}

/**
 * Component to display ticket requests section
 */
export const TicketDetailRequests: React.FC<TicketDetailRequestsProps> = ({
  requests
}) => {
  if (!requests || requests.length === 0) return null;
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-8 relative">
      <h3 className="font-bold mb-3">
        お願い🙏
      </h3>
      <ul className="space-y-2">
        {requests.map((request, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{request}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketDetailRequests;
