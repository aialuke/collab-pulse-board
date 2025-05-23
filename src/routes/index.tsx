
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TermsOfUseDialog } from '@/components/terms/TermsOfUseDialog';
import { RouteErrorBoundary } from '@/components/error/RouteErrorBoundary';

// Loading state component
const PageLoading = lazy(() => import(/* webpackChunkName: "page-loading" */ './PageLoading'));

// Lazy-loaded layout components
const AppLayout = lazy(() => import(/* webpackChunkName: "app-layout" */ '@/components/common/layout/AppLayout'));

// Lazy-loaded page components with named chunks for better debugging
const HomePage = lazy(() => 
  import(/* webpackChunkName: "home-page" */ '@/pages/HomePage')
);
const LoginPage = lazy(() => 
  import(/* webpackChunkName: "login-page" */ '@/pages/LoginPage')
);
const CreateFeedbackPage = lazy(() => 
  import(/* webpackChunkName: "create-feedback-page" */ '@/pages/CreateFeedbackPage')
);
const FeedbackDetailPage = lazy(() => 
  import(/* webpackChunkName: "feedback-detail-page" */ '@/pages/FeedbackDetailPage')
);
const ProfilePage = lazy(() => 
  import(/* webpackChunkName: "profile-page" */ '@/pages/ProfilePage')
);
const NotFound = lazy(() => 
  import(/* webpackChunkName: "not-found-page" */ '@/pages/NotFound')
);

// Protected route component that also checks for terms acceptance
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      <RouteErrorBoundary>{children}</RouteErrorBoundary>
      <TermsOfUseDialog open={showTerms} />
    </>
  );
};

export const AppRoutes: React.FC = () => {
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
            <RouteErrorBoundary>
              <LoginPage />
            </RouteErrorBoundary>
          </Suspense>
        } 
      />
      
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
