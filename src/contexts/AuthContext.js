import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUser(user);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Check if user has permission
  const hasPermission = (module, action) => {
    if (!userProfile || !userProfile.permissions) return false;
    if (userProfile.role === 'ADMINISTRATOR') return true;
    return userProfile.permissions[module]?.[action] || false;
  };

  // Check if user is admin
  const isAdmin = () => userProfile?.role === 'ADMINISTRATOR';

  const value = {
    user,
    userProfile,
    loading,
    hasPermission,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
