// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Update last login
            await updateDoc(userDocRef, {
              lastLoginAt: new Date().toISOString()
            });
            
            setUser(user);
            setUserProfile(userData);
          } else {
            console.error('No user profile found');
            await signOut(auth);
            setError('User profile not found');
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      if (userData.status === 'disabled') {
        await signOut(auth);
        throw new Error('Account is disabled');
      }
      
      setUser(userCredential.user);
      setUserProfile(userData);
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };

  const hasPermission = (module, action) => {
    if (!userProfile || !userProfile.permissions) return false;
    if (userProfile.role === 'ADMINISTRATOR') return true;
    
    const normalizedModule = module.toLowerCase().replace(/\s+/g, '');
    const normalizedAction = action.toLowerCase().replace(/\s+/g, '');
    
    return userProfile.permissions[normalizedModule]?.[normalizedAction] || false;
  };

  const isAdmin = () => userProfile?.role === 'ADMINISTRATOR';

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    logout,
    hasPermission,
    isAdmin,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
