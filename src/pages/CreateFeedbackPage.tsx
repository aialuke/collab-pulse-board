
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateFeedbackForm } from '@/components/feedback/form/CreateFeedbackForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateFeedbackInput } from '@/types/feedback';
import { useCreateFeedbackMutation } from '@/hooks/feedback/useFeedbackMutations';
import { useToast } from '@/hooks/use-toast';

export default function CreateFeedbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { mutate: createFeedback, isPending: isSubmitting } = useCreateFeedbackMutation({
    onSuccess: () => navigate('/'),
    onError: (error) => {
      console.error('Error submitting feedback:', error);
    }
  });

  const handleSubmit = (feedback: CreateFeedbackInput) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit feedback.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    createFeedback(feedback);
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
