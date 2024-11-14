import { create } from 'zustand';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInAnonymously, 
  signInWithPopup,
  signOut as firebaseSignOut, 
  updateProfile,
  User 
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  displayName: string | null;
  signInAnon: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateDisplayName: (name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  loading: true,
  displayName: null,
  signInAnon: async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  },
  signInWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  },
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, isAdmin: false, displayName: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
  setUser: (user) => set({ 
    user,
    isAdmin: user?.uid === 'ADMIN_UID',
    displayName: user?.displayName,
    loading: false 
  }),
  updateDisplayName: async (name) => {
    const { user } = get();
    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        set({ displayName: name });
      } catch (error) {
        console.error('Error updating display name:', error);
      }
    }
  }
}));