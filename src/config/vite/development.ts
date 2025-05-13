
import { componentTagger } from "lovable-tagger";

// Development-specific configuration with optimized component tagging
export const configureDevelopment = () => componentTagger({ 
  include: ["src/components/**/*.tsx"] // Limit tagging to component files only to reduce build time
});
