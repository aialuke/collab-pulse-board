
import { supabase } from '@/integrations/supabase/client';

export async function reportFeedback(feedbackId: string): Promise<void> {
  // For now, just log the report. In a real app, this would store the report in a database
  console.log(`Feedback ${feedbackId} reported`);
  // Could be implemented as a table in the future
  return Promise.resolve();
}
