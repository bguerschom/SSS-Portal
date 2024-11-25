import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6R4Lw5Yw0BCkyR-qv6UXNnJvKq-SKWEk",
  authDomain: "sss-portal-63e5f.firebaseapp.com",
  projectId: "sss-portal-63e5f",
  storageBucket: "sss-portal-63e5f.firebasestorage.app",
  messagingSenderId: "441365546127",
  appId: "1:441365546127:web:51ae9f9588f8782d0a5cfa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const COLLECTIONS = {
  USERS: 'users',
  STAKEHOLDER_REQUESTS: 'stakeholder_requests',
  BACKGROUND_CHECKS: 'background_checks',
  BADGE_REQUESTS: 'badge_requests',
  ACCESS_REQUESTS: 'access_requests',
  ATTENDANCE: 'attendance',
  VISITORS: 'visitors',
  REPORTS: 'reports',
  ACTIVITY_LOGS: 'activityLogs'
};

export default app;
