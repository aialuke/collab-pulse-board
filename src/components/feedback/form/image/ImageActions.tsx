
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Link, Loader2, X } from 'lucide-react';

interface ImageActionsProps {
  hasImage: boolean;
  hasLink: boolean;
  isCompressing: boolean;
  showLinkInput: boolean;
  disabled: boolean;
  onUploadClick: () => void;
  onLinkClick: () => void;
  onRemoveClick: () => void;
}

export function ImageActions({
  hasImage,
  hasLink,
  isCompressing,
  showLinkInput,
  disabled,
  onUploadClick,
  onLinkClick,
  onRemoveClick
}: ImageActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUploadClick}
        disabled={disabled || hasImage || isCompressing || showLinkInput}
      >
        <Image className="mr-2 h-4 w-4" />
        Upload Image
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onLinkClick}
        disabled={disabled || isCompressing || hasImage}
      >
        <Link className="mr-2 h-4 w-4" />
        Attach Link
      </Button>
      
      {(hasImage || hasLink) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemoveClick}
          className="text-red-500"
          disabled={disabled}
        >
          <X className="mr-2 h-4 w-4" />
          Remove
        </Button>
      )}
      
      {isCompressing && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Compressing...
        </div>
      )}
    </div>
  );
}
