
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { RefreshProvider } from "@/contexts/RefreshContext";
import { createQueryClient } from "@/lib/react-query";
import { AppRoutes } from "./routes";

// PWA Components - loaded conditionally based on need
const PWAInstallPrompt = lazy(() => import("./components/pwa/PWAInstallPrompt").then(module => ({default: module.PWAInstallPrompt})));
const OfflineIndicator = lazy(() => import("./components/pwa/OfflineIndicator").then(module => ({default: module.OfflineIndicator})));

// Create QueryClient instance outside component to avoid recreation
const queryClient = createQueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsProvider>
            <RefreshProvider>
              <TooltipProvider>
                <Toaster />
                <AppRoutes />
                
                {/* Load PWA components only when idle */}
                <React.Suspense fallback={null}>
                  <PWAInstallPrompt />
                </React.Suspense>
                <React.Suspense fallback={null}>
                  <OfflineIndicator />
                </React.Suspense>
              </TooltipProvider>
            </RefreshProvider>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
