
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { RefreshProvider } from "@/contexts/RefreshContext";
import { TermsOfUseDialog } from "@/components/terms/TermsOfUseDialog";
import { createQueryClient } from "@/lib/react-query";

// Layout
import { AppLayout } from "./components/layout/AppLayout";

// PWA Components
import { PWAInstallPrompt } from "./components/pwa/PWAInstallPrompt";
import { OfflineIndicator } from "./components/pwa/OfflineIndicator";
import { Skeleton } from "./components/ui/skeleton";

// Lazy loaded pages with preloading hints
const HomePage = lazy(() => {
  // Add preloading hints for browser optimization
  if (typeof window !== 'undefined') {
    const pagePath = import.meta.url.replace(/\/src\/App\.tsx$/, '/src/pages/HomePage.tsx');
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = pagePath;
    document.head.appendChild(link);
  }
  return import("./pages/HomePage");
});

const LoginPage = lazy(() => import("./pages/LoginPage"));
const CreateFeedbackPage = lazy(() => import("./pages/CreateFeedbackPage"));
const FeedbackDetailPage = lazy(() => import("./pages/FeedbackDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component - optimized with memoization
const PageLoading = React.memo(() => (
  <div className="w-full h-full min-h-[50vh] flex flex-col space-y-4 p-8">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full mx-auto" />
    <Skeleton className="h-8 w-2/4 mx-auto" />
    <Skeleton className="h-32 w-5/6 mx-auto" />
  </div>
));
PageLoading.displayName = 'PageLoading';

// Protected route component that also checks for terms acceptance
const ProtectedRoute = React.memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showTerms, setShowTerms] = React.useState(false);

  React.useEffect(() => {
    // Only show terms dialog if user is authenticated and hasn't accepted terms
    if (isAuthenticated && user && !user.hasAcceptedTerms) {
      setShowTerms(true);
    } else {
      setShowTerms(false);
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <TermsOfUseDialog open={showTerms} />
    </>
  );
});
ProtectedRoute.displayName = 'ProtectedRoute';

// This component needs to be inside the AuthProvider
const AppRoutesWithAuth = React.memo(() => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <Suspense fallback={<PageLoading />}>
            <LoginPage />
          </Suspense>
        } 
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={
          <Suspense fallback={<PageLoading />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="create" element={
          <Suspense fallback={<PageLoading />}>
            <CreateFeedbackPage />
          </Suspense>
        } />
        <Route path="feedback/:id" element={
          <Suspense fallback={<PageLoading />}>
            <FeedbackDetailPage />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<PageLoading />}>
            <ProfilePage />
          </Suspense>
        } />
      </Route>
      
      <Route path="*" element={
        <Suspense fallback={<PageLoading />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
});
AppRoutesWithAuth.displayName = 'AppRoutesWithAuth';

// Create QueryClient instance at app initialization time but outside of render cycles
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
                <AppRoutesWithAuth />
                <PWAInstallPrompt />
                <OfflineIndicator />
              </TooltipProvider>
            </RefreshProvider>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
