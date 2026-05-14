'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Standard import
import firebaseConfig from '../firebase-applet-config.json';

let appInstance: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;

/**
 * Safely gets the Firebase Auth service.
 */
export function getAuthService(): Auth | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!appInstance) {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  if (!authInstance) {
    authInstance = getAuth(appInstance);
  }
  return authInstance;
}

/**
 * Safely gets the Firestore service.
 */
export function getFirestoreService(): Firestore | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!appInstance) {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  if (!dbInstance) {
    dbInstance = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId);
  }
  return dbInstance;
}

// Lazy initialize provider
let provider: GoogleAuthProvider | undefined;
export const getGoogleProvider = () => {
  if (typeof window === 'undefined') return {} as GoogleAuthProvider;
  if (!provider) {
    provider = new GoogleAuthProvider();
  }
  return provider;
};

export { signInWithPopup, signOut };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  if (typeof window === 'undefined') return;
  
  const authService = getAuthService();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authService?.currentUser?.uid,
      email: authService?.currentUser?.email,
      emailVerified: authService?.currentUser?.emailVerified,
      isAnonymous: authService?.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
