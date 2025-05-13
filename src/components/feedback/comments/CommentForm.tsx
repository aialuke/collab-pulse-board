
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { SendHorizontal, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  feedbackId: string;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  compact?: boolean;
}

export function CommentForm({ 
  feedbackId, 
  onSubmit, 
  isSubmitting = false, 
  compact = false 
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a comment.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some content for your comment.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSubmit(content);
      setContent(''); // Clear the input on successful submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="bg-white border-neutral-200 text-neutral-900 flex-1"
          disabled={isSubmitting}
          aria-label="Comment text"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isSubmitting || !content.trim()} 
          className="bg-gradient-teal hover:shadow-teal-glow text-white h-10 w-10"
          title="Post comment"
        >
          <Mail className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[100px] bg-white border-neutral-200 text-neutral-900"
        disabled={isSubmitting}
        aria-label="Comment text"
      />
      <div className="flex justify-end mt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()} 
          className="bg-gradient-teal hover:shadow-teal-glow text-white"
        >
          <SendHorizontal className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}
