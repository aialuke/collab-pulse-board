
// Import the toast from shadcn/ui toast
import { type ToasterToast } from "@/components/ui/toast";
import { useToast as useShadcnToast } from "@/components/ui/toast";

// Re-export the useToast hook 
export const useToast = useShadcnToast;

// Create a function to get the toast
export function toast(props: Omit<ToasterToast, "id" | "open" | "onOpenChange">) {
  return useShadcnToast().toast(props);
}

// Export types
export type { ToasterToast };
