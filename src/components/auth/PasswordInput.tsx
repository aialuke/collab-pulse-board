import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon } from "@/components/icons";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  forgotPasswordLink?: boolean;
  disabled?: boolean;
  isNewPassword?: boolean;
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  label = "Password",
  forgotPasswordLink = false,
  disabled = false,
  isNewPassword = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1 text-left">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-neutral-900">
          {label}
        </Label>
        {forgotPasswordLink && (
          <a href="#" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <div className="input-group">
          <div className="input-icon-container">
            <LockIcon className="h-5 w-5" />
          </div>
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="pl-10 pr-10 border-neutral-200 text-neutral-900 focus:border-teal-500 focus:ring-teal-500 w-full"
            aria-label={label}
            autoComplete={isNewPassword ? "new-password" : "current-password"}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
