
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type TermsCheckboxItemProps = {
  id: string;
  title: string;
  content: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function TermsCheckboxItem({ 
  id, 
  title, 
  content, 
  checked, 
  onCheckedChange 
}: TermsCheckboxItemProps) {
  return (
    <div className="flex items-center justify-between border border-neutral-200 rounded-md p-3 mb-2 bg-white/80">
      <div className="flex-1 text-left">
        <Label htmlFor={id} className="text-base font-medium text-neutral-800 cursor-pointer">
          {title}
        </Label>
        <p className="text-sm text-neutral-600 mt-1">{content}</p>
      </div>
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        className="ml-4 h-5 w-5 border-2 border-neutral-400"
      />
    </div>
  );
}
