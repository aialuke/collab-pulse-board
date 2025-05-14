
// Re-export all feedback-related services from the feedback directory
export * from './feedback';

// Export image service functions explicitly
export { uploadFeedbackImage } from './feedback/imageService';

// Export the read feedback services with a more descriptive name
export { fetchFeedback, fetchFeedbackById } from './feedback/readFeedbackService';
