// components/layout/Layout.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../shared/Sidebar";
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, logOut } = useAuth();

  const handleNavigate = (path, subItem) => {
    if (subItem) {
      navigate(`/${path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      navigate(`/${path}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Sidebar
        activePage={location.pathname.split('/')[1]}
        onNavigate={handleNavigate}
        userProfile={userProfile}
      />
      <main className="ml-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
