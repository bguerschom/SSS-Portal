import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Layout from './components/layout/Layout';

// Protected Route wrapper component
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermission && !hasPermission(...requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  const { user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return <div>Loading...</div>;
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
              <ProtectedRoute>
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
