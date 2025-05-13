
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateFeedbackForm } from '@/components/feedback/form/CreateFeedbackForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreateFeedbackInput } from '@/types/feedback';
import { createFeedback } from '@/services/feedbackService';
import { supabase } from '@/integrations/supabase/client';

export default function CreateFeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (feedback: CreateFeedbackInput) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit feedback.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle image upload first if there is an image
      let imageUrl: string | undefined = undefined;
      if (feedback.imageUrl && feedback.imageUrl.startsWith('data:')) {
        // Convert base64 to file
        const res = await fetch(feedback.imageUrl);
        const blob = await res.blob();
        const file = new File([blob], `feedback-image-${Date.now()}.${blob.type.split('/')[1]}`, { type: blob.type });

        // Upload to Supabase Storage
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('feedback-images')
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrl;
      } else if (feedback.imageUrl) {
        // If it's already a URL (not base64), use it directly
        imageUrl = feedback.imageUrl;
      }

      // Create feedback with the image URL if present
      await createFeedback({
        ...feedback,
        imageUrl
      });

      toast({
        title: 'Feedback submitted',
        description: 'Your feedback has been successfully submitted.',
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: error.message || 'There was a problem submitting your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <CreateFeedbackForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
