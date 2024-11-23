import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const userRoles = {
  ADMIN: 'ADMINISTRATOR',
  USER: 'USER',
  OPERATOR: 'OPERATOR'
};

// Default permissions template
const defaultPermissions = {
  stakeholder: {
    newRequest: false,
    update: false,
    pending: false
  },
  backgroundCheck: {
    newRequest: false,
    update: false,
    pending: false
  },
  badgeRequest: {
    newRequest: false,
    pending: false
  },
  accessRequest: {
    newRequest: false,
    update: false,
    pending: false
  },
  attendance: {
    newRequest: false,
    update: false,
    pending: false
  },
  visitorsManagement: {
    newRequest: false,
    update: false,
    pending: false
  },
  reports: {
    view: false
  }
};

// Create new user
export const createUser = async (email, password, role = userRoles.USER) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      role,
      permissions: defaultPermissions,
      createdAt: serverTimestamp(),
      status: 'active'
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Sign in user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    if (userData.status === 'disabled') {
      await signOut(auth);
      throw new Error('Account is disabled');
    }

    return {
      user: userCredential.user,
      profile: userData
    };
  } catch (error) {
    throw error;
  }
};

// Sign out
export const logOut = () => signOut(auth);

// Get user profile with roles and permissions
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    return userDoc.data();
  } catch (error) {
    throw error;
  }
};
