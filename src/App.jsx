import React, { Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import LoginPage from './components/auth/LoginPage';
import WelcomePage from './components/dashboard/WelcomePage';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

// Session Handler Component
const SessionHandler = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate;

  // Session timeout handling logic
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <SessionHandler>
          {user ? (
            <Layout>
              <WelcomePage />
            </Layout>
          ) : (
            <LoginPage />
          )}
        </SessionHandler>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
