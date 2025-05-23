
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContentInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export function ContentInput({ value, onChange, disabled = false }: ContentInputProps) {
  return (
    <div className="space-y-2">
      <Textarea
        id="content"
        placeholder="Describe your feedback in detail..."
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={4}
        aria-label="Feedback details"
      />
    </div>
  );
}
