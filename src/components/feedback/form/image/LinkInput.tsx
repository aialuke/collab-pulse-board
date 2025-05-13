
import React from 'react';
import { Input } from '@/components/ui/input';

interface LinkInputProps {
  linkUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function LinkInput({ linkUrl, onChange, disabled = false }: LinkInputProps) {
  return (
    <Input
      type="url"
      placeholder="Enter a URL"
      value={linkUrl}
      onChange={onChange}
      disabled={disabled}
      className="mt-2"
      aria-label="Link URL"
    />
  );
}
