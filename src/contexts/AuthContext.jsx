import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            const newProfile = {
              uid: user.uid,
              email: user.email,
              role: 'USER',
              status: 'active',
              permissions: {
                stakeholder: {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                },
                backgroundCheck: {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                },
                badgeRequest: {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                },
                accessRequest: {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                },
                attendance: {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                },
                visitorsManagement: {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false
                },
                reports: {
                  view: false,
                  create: false
                }
              },
              isFirstLogin: true,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            };
            
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          } else {
            // Update last login
            const userData = userDoc.data();
            await setDoc(
              userDocRef, 
              { lastLogin: serverTimestamp() }, 
              { merge: true }
            );
            setUserProfile(userData);
          }
          setUser(user);
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

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is active
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const userData = userDoc.data();
      
      if (userData?.status !== 'active') {
        await firebaseSignOut(auth);
        throw new Error('Account is inactive. Please contact administrator.');
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          { lastLogout: serverTimestamp() },
          { merge: true }
        );
      }
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const hasPermission = (module, action) => {
    if (!userProfile) return false;
    if (userProfile.role === 'ADMINISTRATOR') return true;
    return userProfile.permissions?.[module]?.[action] === true;
  };

  const isAdmin = () => userProfile?.role === 'ADMINISTRATOR';
  const isFirstTimeUser = () => userProfile?.isFirstLogin === true;

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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
