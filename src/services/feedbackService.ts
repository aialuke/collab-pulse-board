
// Re-export all feedback-related services from the feedback directory
export * from './feedback';
export * from './feedback/imageService';

// Export uploadFeedbackImage specifically to fix import error
export { uploadFeedbackImage } from './feedback/imageService';
