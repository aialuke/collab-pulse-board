
import React from 'react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="font-bold text-xl text-neutral-900">Team QAB</div>
    </Link>
  );
}
