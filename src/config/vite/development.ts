
import { componentTagger } from "lovable-tagger";
import { PluginOption } from "vite";

// Development-specific configuration
export const configureDevelopment = (): PluginOption => {
  // Return the componentTagger plugin
  return componentTagger();
};
