import React, { Suspense, useState, useEffect } from 'react';
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

// Session timeout duration (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

// Session Handler Component
const SessionHandler = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    let timeoutId;
    
    const resetTimer = () => {
      if (user) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            await signOut();
            navigate('/login', { 
              replace: true,
              state: { message: 'Session expired. Please login again.' }
            });
          } catch (error) {
            console.error('Session timeout error:', error);
          }
        }, SESSION_TIMEOUT);
      }
    };

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart'
    ];

    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [user, signOut, navigate]);

  return children;
};

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission, isFirstTimeUser, isAdmin } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isFirstTimeUser() && !isAdmin() && location.pathname !== '/dashboard') {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to SSS Portal</h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Please wait while an administrator assigns your permissions.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (requiredPermission && !hasPermission(...requiredPermission) && !isAdmin()) {
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
    return <LoadingScreen />;
  }

  
};

export default App;
