import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  collection,
  query,
  where,
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const PERMISSIONS = {
  STAKEHOLDER: 'stakeholder',
  BACKGROUND_CHECK: 'background_check',
  BADGE_REQUEST: 'badge_request',
  ACCESS_REQUEST: 'access_request',
  ATTENDANCE: 'attendance',
  VISITORS: 'visitors',
  REPORTS: 'reports'
};

export const getDefaultPermissions = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return Object.values(PERMISSIONS);
    case ROLES.USER:
      return [];
    default:
      return [];
  }
};

export const createUserRole = async (uid, role = ROLES.USER) => {
  const userRoleRef = doc(db, 'user_roles', uid);
  const permissions = getDefaultPermissions(role);
  
  await setDoc(userRoleRef, {
    role,
    permissions,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return { role, permissions };
};

export const getUserRole = async (uid) => {
  const userRoleRef = doc(db, 'user_roles', uid);
  const snapshot = await getDoc(userRoleRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const hasPermission = (userRole, permission) => {
  return userRole?.permissions?.includes(permission) || userRole?.role === ROLES.ADMIN;
};

export const getAllUsers = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
