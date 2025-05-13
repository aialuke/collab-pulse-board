
import React, { useState } from 'react';
import { CompressionStats, useImageCompression } from './ImageUtils';
import { ImagePreview } from './ImagePreview';
import { LinkInput } from './LinkInput';
import { ImageActions } from './ImageActions';

interface ImageUploadProps {
  image: string | null;
  setImage: (image: string | null) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  disabled?: boolean;
  setIsCompressing?: (value: boolean) => void;
}

export function ImageUpload({ 
  image, 
  setImage, 
  linkUrl,
  setLinkUrl,
  disabled = false, 
  setIsCompressing: setParentIsCompressing 
}: ImageUploadProps) {
  const [compressionStats, setCompressionStats] = useState<CompressionStats | null>(null);
  const [isCompressingLocal, setIsCompressingLocal] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const { compressImageFile } = useImageCompression();
  
  // Use either the provided setIsCompressing or the local state
  const updateCompressingState = (value: boolean) => {
    if (setParentIsCompressing) {
      setParentIsCompressing(value);
    }
    setIsCompressingLocal(value);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear link URL if an image is being uploaded
    setLinkUrl('');
    setShowLinkInput(false);
    updateCompressingState(true);
    
    try {
      const { compressedImage, compressionStats } = await compressImageFile(file);
      setImage(compressedImage);
      setCompressionStats(compressionStats);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      updateCompressingState(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setCompressionStats(null);
  };

  const toggleLinkInput = () => {
    // If we're showing the link input, hide it
    if (showLinkInput) {
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      // If we're showing an image, remove it first
      if (image) {
        removeImage();
      }
      setShowLinkInput(true);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };

  const removeLink = () => {
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <div className="space-y-2">
      <ImageActions 
        hasImage={!!image}
        hasLink={!!linkUrl}
        isCompressing={isCompressingLocal}
        showLinkInput={showLinkInput}
        disabled={disabled}
        onUploadClick={() => document.getElementById('image-upload')?.click()}
        onLinkClick={toggleLinkInput}
        onRemoveClick={image ? removeImage : removeLink}
      />

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        disabled={disabled || isCompressingLocal || showLinkInput}
      />
      
      {showLinkInput && (
        <LinkInput 
          linkUrl={linkUrl}
          onChange={handleLinkChange}
          disabled={disabled}
        />
      )}
      
      {image && (
        <ImagePreview image={image} compressionStats={compressionStats} />
      )}
    </div>
  );
}
