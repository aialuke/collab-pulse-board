
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { RefreshProvider } from "@/contexts/RefreshContext";
import { createQueryClient } from "@/lib/react-query";
import { AppRoutes } from "./routes";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { lazyWithNamedExport } from "@/utils/codeSplitting";

// PWA Components - loaded conditionally based on need with named chunks
const PWAInstallPrompt = lazyWithNamedExport(
  () => import(/* webpackChunkName: "pwa-install-prompt" */ "./components/pwa/PWAInstallPrompt"),
  'PWAInstallPrompt',
  'PWAInstallPrompt'
);
const OfflineIndicator = lazyWithNamedExport(
  () => import(/* webpackChunkName: "offline-indicator" */ "./components/pwa/OfflineIndicator"),
  'OfflineIndicator',
  'OfflineIndicator'
);

// Create QueryClient instance outside component to avoid recreation
const queryClient = createQueryClient();

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationsProvider>
              <RefreshProvider>
                <TooltipProvider>
                  <Toaster />
                  <AppRoutes />
                  
                  {/* Load PWA components only when idle */}
                  <Suspense fallback={null}>
                    <PWAInstallPrompt />
                  </Suspense>
                  <Suspense fallback={null}>
                    <OfflineIndicator />
                  </Suspense>
                </TooltipProvider>
              </RefreshProvider>
            </NotificationsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
