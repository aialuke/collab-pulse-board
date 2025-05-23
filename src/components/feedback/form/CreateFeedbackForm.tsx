
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelect } from './CategorySelect';
import { ImageUpload } from './image/ImageUpload';
import { CreateFeedbackInput } from '@/types/feedback';
import { FeedbackFormValues, feedbackSchema } from '@/utils/validation';

interface CreateFeedbackFormProps {
  /** Function to handle form submission */
  onSubmit: (feedback: CreateFeedbackInput) => void;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
}

export function CreateFeedbackForm({ onSubmit, isLoading = false }: CreateFeedbackFormProps) {
  const [image, setImage] = React.useState<string | null>(null);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: '',
      categoryId: '',
      linkUrl: '',
    }
  });

  const handleSubmit = (values: FeedbackFormValues) => {
    onSubmit({
      content: values.content.trim(),
      categoryId: parseInt(values.categoryId),
      imageUrl: image || undefined,
      linkUrl: values.linkUrl?.trim() || undefined,
    });
  };

  return (
    <Card className="w-full bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Share Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your feedback in detail..."
                      rows={4}
                      disabled={isLoading}
                      aria-label="Feedback details"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      image={image}
                      setImage={setImage}
                      linkUrl={field.value}
                      setLinkUrl={field.onChange}
                      disabled={isLoading}
                      setIsCompressing={setIsCompressing}
                    />
                  </FormControl>
                </FormItem>
              )}
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
      </Form>
    </Card>
  );
}
