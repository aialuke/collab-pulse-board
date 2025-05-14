
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FeedbackType } from '@/types/feedback';
import { getFirstName } from '@/services/feedback/utils';
import { useNavigate } from 'react-router-dom';
import { ImageWithOverlay } from '@/components/ui/image-with-overlay';

interface RepostCardProps {
  feedback: FeedbackType;
}

export function RepostCard({
  feedback
}: RepostCardProps) {
  const firstName = getFirstName(feedback.author.name);
  const isManagerPost = feedback.author.role === 'manager' || feedback.author.role === 'admin';
  const navigate = useNavigate();

  // Truncate content to ~70 characters
  const truncatedContent = feedback.content.length > 70 
    ? `${feedback.content.substring(0, 70)}...` 
    : feedback.content;
    
  const handlePreviewClick = () => {
    navigate(`/feedback/${feedback.id}`);
  };
  
  return (
    <Card 
      className="w-full border border-neutral-200 bg-neutral-100 shadow-none rounded-lg cursor-pointer transition-colors hover:bg-neutral-200"
      onClick={handlePreviewClick}
    >
      <div className="px-3 py-2.5 flex flex-col">
        <div className="flex items-center space-x-2 mb-1.5">
          <Avatar className={`h-5 w-5 ${isManagerPost ? 'ring-1 ring-royal-blue-500/30' : 'ring-1 ring-yellow-500/30'}`}>
            <AvatarImage src={feedback.author.avatarUrl} alt={firstName} />
            <AvatarFallback className={isManagerPost ? "bg-royal-blue-100 text-royal-blue-600 text-xs" : "bg-yellow-100 text-yellow-600 text-xs"}>
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs font-medium leading-none">{firstName}</p>
        </div>
        <p className="text-xs text-neutral-700 line-clamp-2 mb-2">{truncatedContent}</p>
        
        {feedback.imageUrl && (
          <div className="w-full">
            <ImageWithOverlay 
              src={feedback.imageUrl} 
              alt="Preview" 
              aspectRatio={16/9}
              width={800}
              height={450}
              className="rounded-sm"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
