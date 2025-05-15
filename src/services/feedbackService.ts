
/**
 * Centralized export file for all feedback-related services
 * This improves tree-shaking and helps eliminate duplicate imports
 */

// Export core services
export { fetchFeedback, fetchFeedbackById } from './feedback/readFeedbackService';
export { uploadFeedbackImage } from './feedback/imageService';

// Export social interaction services
export { toggleUpvote } from './feedback/upvoteService';
export { reportFeedback } from './feedback/statusService'; // Fixed import source
export { repostFeedback as createRepost } from './feedback/repostService'; // Aliased to match expected name

// Export remaining services
export * from './feedback';
