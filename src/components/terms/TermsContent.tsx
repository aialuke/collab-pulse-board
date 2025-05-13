
import React from 'react';

type TermContentProps = {
  title: string;
  content: string;
};

export function TermContent({ title, content }: TermContentProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-neutral-800 mb-1">{title}</h3>
      <p className="text-sm text-neutral-600">{content}</p>
    </div>
  );
}
