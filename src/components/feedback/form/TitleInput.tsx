
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TitleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function TitleInput({ value, onChange, disabled = false }: TitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        placeholder="Enter a descriptive title"
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={100}
        aria-label="Feedback title"
      />
    </div>
  );
}
