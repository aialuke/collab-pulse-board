
import { queueErrorToast } from '@/components/error/ToastErrorHandler';

/**
 * Safe toast service that can be used outside of React components
 * This queues toast notifications to be displayed when the ToastErrorHandler component is mounted
 */
export const toastService = {
  /**
   * Show an error toast - safe to use outside React components
   */
  error(message: string, title = "Error") {
    queueErrorToast(message);
  },
  
  /**
   * Show an info toast - this is just a placeholder and will be implemented
   * in the ToastErrorHandler when needed
   */
  info(message: string) {
    // Just log for now, actual toast will be shown by ToastErrorHandler
    console.log("[Toast Info]", message);
    queueErrorToast(message);
  },
  
  /**
   * Show a success toast - this is just a placeholder and will be implemented
   * in the ToastErrorHandler when needed
   */
  success(message: string) {
    // Just log for now, actual toast will be shown by ToastErrorHandler
    console.log("[Toast Success]", message);
    queueErrorToast(message);
  }
};
