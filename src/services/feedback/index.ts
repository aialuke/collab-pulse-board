
// Consolidated exports for feedback services
// Organize by functionality for better tree-shaking

// Core API services
export * from './feedbackApi';

// Feedback CRUD operations
export * from './createFeedbackService';
export * from './readFeedbackService';
export * from './deleteFeedbackService';

// Social interaction services
export * from './upvoteService';
export * from './repostService';

// Categorization services
export * from './categoryService';
export * from './statusService';

// Data transformation - explicit exports to avoid duplication
export { 
  mapFeedbackItem, 
  mapFeedbackItems, 
  extractCategoryName, 
  extractProfileInfo, 
  getFirstName 
} from './mappers';

// Image handling
export * from './imageService';
