
// Re-export feedback-related services from the feedback directory
export * from './feedback';

// Export specific functions for direct use
export { reportFeedback } from './feedback/statusService';
export { toggleUpvote } from './feedback/upvoteService';
export { fetchFeedback, fetchFeedbackById } from './feedback/readFeedbackService';
