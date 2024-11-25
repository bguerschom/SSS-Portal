import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create new user profile for first-time users
            const newProfile = {
              uid: user.uid,
              email: user.email,
              role: 'USER',
              permissions: {},
              isFirstLogin: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              status: 'active'
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          } else {
            // Update existing user's last login
            const existingProfile = userDoc.data();
            await updateDoc(userDocRef, {
              lastLogin: new Date().toISOString()
            });
            setUserProfile(existingProfile);
          }
          setUser(user);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Authentication error: ' + err.message);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is active
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      if (userData?.status !== 'active') {
        await firebaseSignOut(auth);
        throw new Error('Account is inactive. Please contact administrator.');
      }

      return userCredential.user;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Permission checking
  const hasPermission = (module, action) => {
    if (!userProfile) return false;
    if (userProfile.role === 'ADMINISTRATOR') return true;
    
    const modulePermissions = userProfile.permissions?.[module];
    if (!modulePermissions) return false;
    
    if (action === 'view') {
      return Object.values(modulePermissions).some(permission => permission === true);
    }
    
    return modulePermissions[action] === true;
  };

  const isAdmin = () => userProfile?.role === 'ADMINISTRATOR';
  const isFirstTimeUser = () => userProfile?.isFirstLogin === true;

  // Profile update function
  const updateUserProfile = async (updates) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signOut,
    hasPermission,
    isAdmin,
    isFirstTimeUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
