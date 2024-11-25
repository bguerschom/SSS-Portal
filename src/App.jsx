import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import LoginPage from './components/auth/LoginPage';
import WelcomePage from './components/dashboard/WelcomePage';
import StakeHolder from './components/dashboard/StakeHolder';
import BackgroundCheck from './components/dashboard/BackgroundCheck';
import BadgeRequest from './components/dashboard/BadgeRequest';
import AccessRequest from './components/dashboard/AccessRequest';
import Attendance from './components/dashboard/Attendance';
import VisitorsManagement from './components/dashboard/VisitorsManagement';
import Reports from './components/dashboard/Reports';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFoundPage from './components/common/NotFoundPage';

// Simple loading component if you don't want to create a separate file
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

// Protected Route wrapper component
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission, isFirstTimeUser } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // First-time users can only access dashboard
  if (isFirstTimeUser() && location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (requiredPermission && !hasPermission(...requiredPermission)) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your administrator.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return children;
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <WelcomePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/stakeholder/:action"
            element={
              <ProtectedRoute requiredPermission={['stakeholder', 'view']}>
                <Layout>
                  <StakeHolder />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/background/:action"
            element={
              <ProtectedRoute requiredPermission={['backgroundCheck', 'view']}>
                <Layout>
                  <BackgroundCheck />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/badge/:action"
            element={
              <ProtectedRoute requiredPermission={['badgeRequest', 'view']}>
                <Layout>
                  <BadgeRequest />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/access/:action"
            element={
              <ProtectedRoute requiredPermission={['accessRequest', 'view']}>
                <Layout>
                  <AccessRequest />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/:action"
            element={
              <ProtectedRoute requiredPermission={['attendance', 'view']}>
                <Layout>
                  <Attendance />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/visitors/:action"
            element={
              <ProtectedRoute requiredPermission={['visitorsManagement', 'view']}>
                <Layout>
                  <VisitorsManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/:type"
            element={
              <ProtectedRoute requiredPermission={['reports', 'view']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredPermission={['admin', 'view']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard or login */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />

          {/* 404 page */}
          <Route 
            path="*" 
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
