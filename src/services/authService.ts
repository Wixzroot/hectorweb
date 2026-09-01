/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const provider = new GoogleAuthProvider();

export const authService = {
  isLoggingIn: false,
  async loginWithGoogle() {
    if (this.isLoggingIn) return;
    this.isLoggingIn = true;
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.warn('Login popup was closed or cancelled.');
        return null;
      }
      if (error.code?.includes('api-key-not-valid') || error.message?.includes('api-key-not-valid')) {
        console.warn('Firebase Auth API Key issue detected. Firebase Identity Toolkit API key restriction.');
        alert('Google Authentication notice: Firebase Auth Identity API key requires configuration. You can manage site configuration and plans directly in the Admin area.');
        return null;
      }
      console.error('Login error:', error);
      throw error;
    } finally {
      this.isLoggingIn = false;
    }
  },

  async logout() {
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async isAdmin(uid: string, email: string | null = null) {
    const ADMIN_EMAILS = [
      'anshalmanoj2011@gmail.com',
      'anshalmanojgaming@gmail.com'
    ];
    if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true;
    
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      return adminDoc.exists();
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  }
};
