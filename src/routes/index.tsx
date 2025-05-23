import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TermsOfUseDialog } from '@/components/terms/TermsOfUseDialog';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';
import { lazyWithChunkName } from '@/utils/codeSplitting';

// Loading state component - smaller bundle so can be imported directly
const PageLoading = lazyWithChunkName(
  () => import(/* webpackChunkName: "page-loading" */ './PageLoading'), 
  'PageLoading'
);

// Lazy-loaded layouts with descriptive chunk names
const AppLayout = lazyWithChunkName(
  () => import(/* webpackChunkName: "app-layout" */ '@/components/common/layout/AppLayout'), 
  'AppLayout'
);
const AuthLayout = lazyWithChunkName(
  () => import(/* webpackChunkName: "auth-layout" */ '@/components/auth/AuthLayout'),
  'AuthLayout'
);

// Lazy-loaded page components with named chunks for better debugging
const HomePage = lazyWithChunkName(
  () => import(/* webpackChunkName: "home-page" */ '@/pages/HomePage'),
  'HomePage'
);
const LoginPage = lazyWithChunkName(
  () => import(/* webpackChunkName: "login-page" */ '@/pages/LoginPage'),
  'LoginPage'
);
const CreateFeedbackPage = lazyWithChunkName(
  () => import(/* webpackChunkName: "create-feedback-page" */ '@/pages/CreateFeedbackPage'),
  'CreateFeedbackPage'
);
const FeedbackDetailPage = lazyWithChunkName(
  () => import(/* webpackChunkName: "feedback-detail-page" */ '@/pages/FeedbackDetailPage'),
  'FeedbackDetailPage'
);
const ProfilePage = lazyWithChunkName(
  () => import(/* webpackChunkName: "profile-page" */ '@/pages/ProfilePage'),
  'ProfilePage'
);
const NotFound = lazyWithChunkName(
  () => import(/* webpackChunkName: "not-found-page" */ '@/pages/NotFound'),
  'NotFound'
);

// Protected route component that also checks for terms acceptance
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showTerms, setShowTerms] = React.useState(false);
  const location = useLocation();

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
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <RouteErrorBoundary>{children}</RouteErrorBoundary>
      <TermsOfUseDialog open={showTerms} />
    </>
  );
};

// Public route - redirects to home if authenticated
export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Get the location they were trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';

  if (isLoading) {
    return <PageLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Preload components for routes likely to be visited
// This runs only once when the routes file loads
const preloadHomeRoute = () => {
  import(/* webpackChunkName: "home-page" */ '@/pages/HomePage');
};

// Add an event listener to preload components when hovering over links
document.addEventListener('mouseover', (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === 'A') {
    const href = target.getAttribute('href');
    if (href === '/') {
      preloadHomeRoute();
    }
  }
});

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicOnlyRoute>
            <Suspense fallback={<PageLoading />}>
              <AuthLayout>
                <RouteErrorBoundary>
                  <LoginPage />
                </RouteErrorBoundary>
              </AuthLayout>
            </Suspense>
          </PublicOnlyRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <AppLayout />
            </Suspense>
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
      
      {/* 404 route */}
      <Route path="*" element={
        <Suspense fallback={<PageLoading />}>
          <RouteErrorBoundary>
            <NotFound />
          </RouteErrorBoundary>
        </Suspense>
      } />
    </Routes>
  );
}
