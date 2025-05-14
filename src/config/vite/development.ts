
import { componentTagger } from "lovable-tagger";

// Development-specific configuration
export const configureDevelopment = () => {
  // Return the componentTagger plugin without arguments
  // since it doesn't accept any arguments according to the error
  return componentTagger();
};
