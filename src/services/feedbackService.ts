
/**
 * Centralized export file for all feedback-related services
 * This improves tree-shaking and helps eliminate duplicate imports
 */

// Export core services
export { fetchFeedback, fetchFeedbackById } from './feedback/readFeedbackService';
export { uploadFeedbackImage } from './feedback/imageService';

// Export social interaction services
export { toggleUpvote } from './feedback/upvoteService';
export { reportFeedback } from './feedback/deleteFeedbackService';
export { createRepost } from './feedback/repostService';

// Export remaining services
export * from './feedback';
