
import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { RefreshProvider } from "@/contexts/RefreshContext";
import { createQueryClient } from "@/lib/react-query";
import { Skeleton } from "./components/ui/skeleton";
import { ErrorBoundary } from "./components/utils/ErrorBoundary";

// Only load layout component when route is accessed
const AppLayout = lazy(() => import("./components/layout/AppLayout"));

// PWA Components - loaded conditionally based on need
const PWAInstallPrompt = lazy(() => import("./components/pwa/PWAInstallPrompt").then(module => ({default: module.PWAInstallPrompt})));
const OfflineIndicator = lazy(() => import("./components/pwa/OfflineIndicator").then(module => ({default: module.OfflineIndicator})));

// Lazy loaded pages with improved code chunking
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CreateFeedbackPage = lazy(() => import("./pages/CreateFeedbackPage"));
const FeedbackDetailPage = lazy(() => import("./pages/FeedbackDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component - optimized with memo
const PageLoading = () => (
  <div className="w-full h-full min-h-[50vh] flex flex-col space-y-4 p-8">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full mx-auto" />
    <Skeleton className="h-8 w-2/4 mx-auto" />
    <Skeleton className="h-32 w-5/6 mx-auto" />
  </div>
);

// Protected route component that also checks for terms acceptance
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  
  // Lazy load TermsOfUseDialog only when needed
  const TermsOfUseDialog = lazy(() => import("@/components/terms/TermsOfUseDialog").then(
    module => ({ default: module.TermsOfUseDialog })
  ));

  useEffect(() => {
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
      {showTerms && (
        <Suspense fallback={null}>
          <TermsOfUseDialog open={showTerms} />
        </Suspense>
      )}
    </>
  );
};

// This component needs to be inside the AuthProvider
const AppRoutesWithAuth = () => {
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
            <Suspense fallback={<PageLoading />}>
              <ErrorBoundary fallback={
                <div className="p-8 m-4 border border-red-300 rounded-md bg-red-50 text-red-800">
                  <h3 className="text-xl font-medium mb-2">Something went wrong with the layout</h3>
                  <p>Please try refreshing the page or contact support if the issue persists.</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Refresh Page
                  </button>
                </div>
              }>
                <AppLayout />
              </ErrorBoundary>
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={
          <Suspense fallback={<PageLoading />}>
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="create" element={
          <Suspense fallback={<PageLoading />}>
            <ErrorBoundary>
              <CreateFeedbackPage />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="feedback/:id" element={
          <Suspense fallback={<PageLoading />}>
            <ErrorBoundary>
              <FeedbackDetailPage />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<PageLoading />}>
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
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
};

// Create QueryClient instance outside component to avoid recreation
const queryClient = createQueryClient();

function App() {
  return (
    <ErrorBoundary fallback={
      <div className="p-8 m-4 border border-red-300 rounded-md bg-red-50 text-red-800">
        <h3 className="text-xl font-medium mb-2">Application Error</h3>
        <p>The application encountered a critical error. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Application
        </button>
      </div>
    }>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationsProvider>
              <RefreshProvider>
                <TooltipProvider>
                  <Toaster />
                  <AppRoutesWithAuth />
                  
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
