
import { Root } from "@radix-ui/react-aspect-ratio"
import { calculateAspectRatio } from "@/lib/utils"

/**
 * AspectRatio component that maintains a specified aspect ratio for its content
 * Uses Radix UI under the hood for accessibility and performance
 */
const AspectRatio = Root

// Export the component and related utility functions
export { 
  AspectRatio,
  calculateAspectRatio
}
