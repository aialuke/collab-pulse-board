
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FormSubmitOptions<TData, TResponse> {
  /** Function that performs the form submission */
  onSubmit: (data: TData) => Promise<TResponse>;
  /** Function called when submission is successful */
  onSuccess?: (response: TResponse) => void;
  /** Function called when submission fails */
  onError?: (error: Error) => void;
  /** Message to display on successful submission */
  successMessage?: string;
  /** Message to display on failed submission */
  errorMessage?: string;
}

export function useFormSubmit<TData, TResponse = any>({
  onSubmit,
  onSuccess,
  onError,
  successMessage = 'Form submitted successfully',
  errorMessage = 'An error occurred. Please try again.',
}: FormSubmitOptions<TData, TResponse>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: TData) => {
    setIsSubmitting(true);
    
    try {
      const response = await onSubmit(data);
      
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage,
        });
      }
      
      onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      
      toast({
        title: 'Error',
        description: error.message || errorMessage,
        variant: 'destructive',
      });
      
      onError?.(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
