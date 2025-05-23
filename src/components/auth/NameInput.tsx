
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserIcon } from "@/components/icons";

export interface InputProps {
  /** The ID of the input element */
  id: string;
  /** Current value of the input */
  value: string;
  /** Handler function for change events */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder text to display when input is empty */
  placeholder?: string;
  /** Label text displayed above the input */
  label?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

export function NameInput({
  id,
  value,
  onChange,
  placeholder = "John Doe",
  label = "Full Name",
  disabled = false,
}: InputProps) {
  return (
    <div className="space-y-1 text-left">
      <Label htmlFor={id} className="text-neutral-900">{label}</Label>
      <div className="input-group">
        <div className="input-icon-container">
          <UserIcon className="h-5 w-5" />
        </div>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="pl-10 border-neutral-200 text-neutral-900 focus:border-teal-500 focus:ring-teal-500 w-full"
          aria-label={label}
          autoComplete="name"
        />
      </div>
    </div>
  );
}
