
// Centralized export file for all feedback-related services
// This improves tree-shaking and helps eliminate duplicate imports

// Export core services
export { fetchFeedback, fetchFeedbackById } from './feedback/readFeedbackService';
export { uploadFeedbackImage } from './feedback/imageService';

// Re-export all other services
export * from './feedback';
