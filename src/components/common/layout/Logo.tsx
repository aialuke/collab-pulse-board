
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// Memoize the Logo component to prevent unnecessary re-renders
export const Logo = memo(function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="font-bold text-xl text-neutral-900">Team QAB</div>
    </Link>
  );
});
