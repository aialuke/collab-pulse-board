
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ContentInput } from './ContentInput';
import { CategorySelect } from './CategorySelect';
import { ImageUpload } from '@/components/feedback/form/image/ImageUpload';
import { CreateFeedbackInput } from '@/types/feedback';

interface CreateFeedbackFormProps {
  onSubmit: (feedback: CreateFeedbackInput) => void;
  isLoading?: boolean;
}

export function CreateFeedbackForm({ onSubmit, isLoading = false }: CreateFeedbackFormProps) {
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide content for your feedback.",
        variant: "destructive",
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: "Missing category",
        description: "Please select a category for your feedback.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      content: content.trim(),
      categoryId: parseInt(categoryId),
      imageUrl: image || undefined,
      linkUrl: linkUrl.trim() || undefined,
    });
  };

  return (
    <Card className="w-full bg-white">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Share Your Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ContentInput 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />

          <CategorySelect 
            value={categoryId}
            onChange={setCategoryId}
            disabled={isLoading}
          />

          <ImageUpload 
            image={image}
            setImage={setImage}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            disabled={isLoading}
            setIsCompressing={setIsCompressing}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isCompressing}
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
