import React, { useState, useEffect } from 'react';
import LoginPage from './components/auth/LoginPage';
import WelcomePage from './components/dashboard/WelcomePage';
import StakeHolder from './components/dashboard/StakeHolder';
import BackgroundCheck from './components/dashboard/BackgroundCheck';
import BadgeRequest from './components/dashboard/BadgeRequest';
import AccessRequest from './components/dashboard/AccessRequest';
import Attendance from './components/dashboard/Attendance';
import VisitorsManagement from './components/dashboard/VisitorsManagement';
import Reports from './components/dashboard/Reports';

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [username, setUsername] = useState('');
  const [currentSubItem, setCurrentSubItem] = useState(null);

  // Check if user was previously logged in
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const savedUsername = localStorage.getItem('username');
    if (savedLoginState === 'true' && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    // Save login state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setCurrentPage('welcome');
    setCurrentSubItem(null);
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  const handleNavigate = (page, subItem = null) => {
    setCurrentPage(page);
    setCurrentSubItem(subItem);
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render the appropriate page based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'stakeholder':
        return <StakeHolder onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'background':
        return <BackgroundCheck onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'badge':
        return <BadgeRequest onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'access':
        return <AccessRequest onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'attendance':
        return <Attendance onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'visitors':
        return <VisitorsManagement onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} subItem={currentSubItem} />;
      default:
        return (
          <WelcomePage 
            username={username} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {renderPage()}
    </div>
  );
}

export default App;
