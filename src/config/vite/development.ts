
import { componentTagger } from "lovable-tagger";

// Development-specific configuration
export const configureDevelopment = () => {
  // Return the componentTagger plugin with minified CSS option to avoid duplicates
  return componentTagger({
    cssMinification: true, // Add this option to minimize CSS duplication
    compactDebug: true // Make debug output more compact
  });
};
