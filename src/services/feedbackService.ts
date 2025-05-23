
/**
 * Centralized export file for all feedback-related services
 * This improves tree-shaking and helps eliminate duplicate imports
 */

export {
  fetchFeedback,
  fetchFeedbackById,
  createFeedback,
  deleteFeedback,
  toggleFeedbackUpvote as toggleUpvote,
  reportFeedback,
  createRepost,
  uploadFeedbackImage
} from './feedback/feedbackService';

// Export other specialized services that aren't part of the main feedback service
export { fetchCategories } from './feedback/categoryService';
export { createShoutOut, getAllShoutOuts, getShoutOutsForUser } from './feedback/shoutOutService';
