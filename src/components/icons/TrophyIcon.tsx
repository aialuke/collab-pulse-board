
import React from 'react';
import { Trophy } from 'lucide-react';

interface TrophyIconProps {
  className?: string;
  size?: number;
}

export function TrophyIcon({ className = "", size = 24 }: TrophyIconProps) {
  return (
    <span className={`trophy-icon ${className}`}>
      <Trophy size={size} strokeWidth={2} className="text-trophy" />
    </span>
  );
}
