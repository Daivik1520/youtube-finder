import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface StatusIndicatorProps {
  isAvailable: boolean | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isAvailable }) => {
  if (isAvailable === null) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm ${
      isAvailable 
        ? 'bg-green-900/20 border border-green-700 text-green-400' 
        : 'bg-yellow-900/20 border border-yellow-700 text-yellow-400'
    }`}>
      {isAvailable ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isAvailable ? 'yt-dlp Available' : 'Demo Mode Active'}
      </span>
    </div>
  );
};