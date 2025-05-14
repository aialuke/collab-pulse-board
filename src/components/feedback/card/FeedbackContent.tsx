
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FeedbackType } from '@/types/feedback';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface FeedbackContentProps {
  feedback: FeedbackType;
}

export function FeedbackContent({
  feedback
}: FeedbackContentProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const imageSource = feedback.imageUrl || feedback.image;

  return (
    <div className="text-left pl-8 sm:pl-10">
      <p className="text-sm sm:text-base text-neutral-900 mb-2">{feedback.content}</p>
      {imageSource && (
        <>
          <div 
            className="mt-2 rounded-md overflow-hidden cursor-pointer pr-8 sm:pr-10"
            onClick={() => setIsImagePreviewOpen(true)}
          >
            <img 
              src={imageSource} 
              alt="Feedback attachment" 
              className="w-full object-cover h-auto max-h-[150px] sm:max-h-[200px] hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </div>
          
          <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
            <DialogContent className="sm:max-w-3xl md:max-w-4xl p-1 bg-white border-yellow-500/30 w-[95vw] max-h-[90vh]">
              <div className="flex items-center justify-center w-full h-full overflow-auto">
                <img 
                  src={imageSource} 
                  alt="Feedback attachment - Full preview" 
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      {feedback.linkUrl && (
        <div className="mt-2">
          <a 
            href={feedback.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 underline break-all"
          >
            {feedback.linkUrl}
          </a>
        </div>
      )}
    </div>
  );
}
