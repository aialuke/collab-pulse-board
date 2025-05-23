
/**
 * Centralized export file for all feedback-related services
 * Now using the optimized implementations for better performance
 */

// Export optimized core feedback functions
export {
  fetchFeedback,
  fetchFeedbackById,
  fetchProfiles,
  fetchUserUpvotes,
  fetchOriginalPosts
} from './feedback/optimizedFeedbackService';

// Export other specialized services that aren't part of the main feedback service
export { 
  createFeedback,
  deleteFeedback,
  toggleFeedbackUpvote as toggleUpvote,
  reportFeedback,
  createRepost,
  uploadFeedbackImage
} from './feedback/feedbackService';

// Export other services
export { fetchCategories } from './feedback/categoryService';
export { createShoutOut, getAllShoutOuts, getShoutOutsForUser } from './feedback/shoutOutService';
