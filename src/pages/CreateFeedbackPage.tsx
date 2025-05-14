
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateFeedbackForm } from '@/components/feedback/form/CreateFeedbackForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreateFeedbackInput } from '@/types/feedback';
import { createFeedback, uploadFeedbackImage } from '@/services/feedbackService';

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
        // Get the format from the data URL
        const formatInfo = feedback.imageUrl.split(';')[0].split(':')[1];
        const outputFormat = formatInfo === 'image/webp' ? 'webp' : 'jpeg';
        
        // Upload the image using our new service
        imageUrl = await uploadFeedbackImage(user.id, feedback.imageUrl, outputFormat);
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
