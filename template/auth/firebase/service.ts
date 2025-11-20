// @ts-nocheck
import { AuthUser, SendOTPOptions, SignUpResult, GoogleSignInResult } from '../types';
import { getFirebaseApp } from '../../core/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset, User as FirebaseUser } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Visibility change listener related variables for web
let lastVisibilityChange = 0;
let visibilityListener: (() => void) | null = null;

// Operation state tracking to prevent deadlock
let isUpdatingUserInOTPFlow = false;

const TIMEOUT_CONFIG = {
  AUTH_OPERATIONS: 10000,
  DATA_QUERIES: 8000,
  SESSION_REFRESH: 5000,
  USER_UPDATE: 15000,
};

// Utility function to add timeout to any Promise with proper cleanup
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string = 'Operation'
): Promise<T> => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${operation} timeout after ${timeoutMs/1000} seconds`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
};

const isAuthError = (error: any): boolean => {
  return error.code === 'auth/user-not-found' ||
         error.code === 'auth/wrong-password' ||
         error.code === 'auth/invalid-email' ||
         error.code === 'auth/user-disabled' ||
         error.code === 'auth/email-already-in-use' ||
         error.code === 'auth/weak-password';
};

// Visibility monitoring logic - used to optimize auth event handling on web
const setupVisibilityMonitoring = () => {
  if (visibilityListener || Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  visibilityListener = () => {
    lastVisibilityChange = Date.now();
  };

  document.addEventListener('visibilitychange', visibilityListener);
};

export const isVisibilityTriggeredAuthEvent = (event: string): boolean => {
  if (event !== 'SIGNED_IN') return false;

  const timeSinceVisibilityChange = Date.now() - lastVisibilityChange;
  return timeSinceVisibilityChange < 1000;
};

export const getLastVisibilityChange = (): number => lastVisibilityChange;

// Enhanced event filtering to prevent deadlock
export const shouldIgnoreAuthEvent = (event: string): boolean => {
  // Ignore USER_UPDATED events during updateUser operation to prevent deadlock
  if (event === 'USER_UPDATED' && isUpdatingUserInOTPFlow) {
    return true;
  }

  // Ignore visibility-triggered events
  if (isVisibilityTriggeredAuthEvent(event)) {
    return true;
  }

  return false;
};

export class AuthService {
  private auth: any;

  constructor() {
    // Initialize visibility monitoring
    setupVisibilityMonitoring();

    try {
      const firebaseApp = getFirebaseApp();
      this.auth = getAuth(firebaseApp);
    } catch (error) {
      console.error('Firebase auth initialization failed:', error);
      throw error;
    }
  }

  private get firebaseAuth() {
    return this.auth;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const currentUser = this.firebaseAuth.currentUser;
      if (!currentUser) return null;

      // Map Firebase user to AuthUser (unified for all auth methods)
      return this.mapFirebaseUserToAuthUser(currentUser);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Unified Firebase user mapping - used by all auth flows
  private mapFirebaseUserToAuthUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: firebaseUser.displayName ||
               firebaseUser.email?.split('@')[0] ||
               `user_${firebaseUser.uid.slice(0, 8)}`,
      created_at: firebaseUser.metadata.creationTime,
      updated_at: firebaseUser.metadata.lastSignInTime || firebaseUser.metadata.creationTime,
    };
  }

  async sendOTP(email: string, options: SendOTPOptions = {}) {
    try {
      // Firebase doesn't have direct OTP via email, but we can use password reset as a form of verification
      // For now, return an error since this is more complex to implement with Firebase
      return { error: 'Email OTP not supported with Firebase. Use password-based authentication.', errorType: 'business' };
    } catch (error) {
      console.warn('[Template:FirebaseAuthService] SendOTP system exception:', error.message);
      return { error: 'Failed to send verification code', errorType: 'network' };
    }
  }

  async verifyOTPAndLogin(email: string, otp: string, options?: { password?: string }) {
    try {
      // Firebase doesn't have OTP verification like Supabase
      // This would require implementing password reset flow or other email verification
      return { error: 'OTP verification not supported with current Firebase setup', user: null, errorType: 'business' };
    } catch (error) {
      console.warn('[Template:FirebaseAuthService] VerifyOTPAndLogin system exception:', error.message);
      return { error: 'Login failed', user: null, errorType: 'network' };
    }
  }

  async signUpWithPassword(email: string, password: string, metadata: Record<string, any> = {}): Promise<SignUpResult> {
    try {
      const userCredential = await withTimeout(
        createUserWithEmailAndPassword(this.firebaseAuth, email, password),
        TIMEOUT_CONFIG.AUTH_OPERATIONS,
        'SignUp'
      );

      if (userCredential.user) {
        try {
          const authUser = await this.getCurrentUser();
          return { user: authUser };
        } catch (userError) {
          console.warn('[Template:FirebaseAuthService] Error retrieving user after signup:', userError);
          return { error: 'Sign up succeeded but failed to load profile', user: null, errorType: 'network' };
        }
      }

      return { user: null };
    } catch (error) {
      if (isAuthError(error)) {
        let errorMessage = 'Sign up failed';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Email already in use. Please use a different email.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        }
        return { error: errorMessage, errorType: 'business' };
      }

      console.warn('[Template:FirebaseAuthService] SignUpWithPassword system exception:', error.message);
      return { error: 'Sign up failed', errorType: 'network' };
    }
  }

  async signInWithPassword(email: string, password: string) {
    try {
      const userCredential = await withTimeout(
        signInWithEmailAndPassword(this.firebaseAuth, email, password),
        TIMEOUT_CONFIG.AUTH_OPERATIONS,
        'SignIn'
      );

      if (userCredential.user) {
        try {
          const authUser = await this.getCurrentUser();
          if (authUser) {
            return { user: authUser };
          } else {
            return { error: 'Failed to load user profile', user: null, errorType: 'business' };
          }
        } catch (userError) {
          console.warn('[Template:FirebaseAuthService] Error retrieving user after sign in:', userError);
          return { error: 'Sign in succeeded but failed to load profile', user: null, errorType: 'network' };
        }
      }

      return { user: null };
    } catch (error) {
      if (isAuthError(error)) {
        let errorMessage = 'Invalid email or password';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password';
        } else if (error.code === 'auth/user-disabled') {
          errorMessage = 'Account has been disabled';
        }
        return { error: errorMessage, user: null, errorType: 'business' };
      }

      console.warn('[Template:FirebaseAuthService] SignInWithPassword system exception:', error.message);
      return { error: 'Sign in failed', user: null, errorType: 'network' };
    }
  }

  async logout() {
    try {
      await withTimeout(
        firebaseSignOut(this.firebaseAuth),
        TIMEOUT_CONFIG.AUTH_OPERATIONS,
        'Logout'
      );
      return {};
    } catch (error) {
      console.warn('[Template:FirebaseAuthService] Logout error:', error.message);
      return { error: 'Logout failed', errorType: 'network' };
    }
  }

  async signInWithGoogle(): Promise<GoogleSignInResult> {
    try {
      // Generate cross-platform redirect URL
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'byokaicouncil',
        path: 'auth'
      });

      // For Firebase, we need to set up OAuth properly
      // Firebase web SDK can handle Google auth, but for Expo we use AuthSession
      const provider = 'google';
      const scopes = ['openid', 'profile', 'email'];

      // Create OAuth URL manually
      const authUrl = `https://accounts.google.com/oauth/v2/auth?` +
        `client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
        `scope=${encodeURIComponent(scopes.join(' '))}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Web platform: Use Firebase built-in OAuth
      if (Platform.OS === 'web') {
        const userCredential = await withTimeout(
          import('firebase/auth').then(({ signInWithPopup, GoogleAuthProvider }) => {
            const provider = new GoogleAuthProvider();
            return signInWithPopup(this.firebaseAuth, provider);
          }),
          TIMEOUT_CONFIG.AUTH_OPERATIONS,
          'GoogleOAuth'
        );

        if (userCredential.user) {
          return { error: null };
        }
        return { error: 'Google sign in failed' };
      }

      // Mobile platform: Manual OAuth flow
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      // Handle callback
      if (result.type === 'success') {
        const url = result.url;

        try {
          const params = new URL(url).searchParams;
          const code = params.get('code');

          if (!code) {
            const error = params.get('error');
            const errorDescription = params.get('error_description');
            return {
              error: errorDescription || error || 'No authorization code received'
            };
          }

          // Exchange code for Firebase credentials
          // This requires a server-side exchange or Firebase functions
          // For now, we'll implement a simplified version
          return {
            error: 'Mobile Google auth requires Firebase functions setup. Please use web or implement server-side code exchange.'
          };
        } catch (urlError) {
          const errorMsg = urlError instanceof Error ? urlError.message : 'Unknown error';
          return {
            error: `Failed to parse callback: ${errorMsg}`
          };
        }
      } else if (result.type === 'cancel') {
        return { error: 'User cancelled login' };
      } else if (result.type === 'dismiss') {
        return { error: 'Browser dismissed' };
      } else if (result.type === 'locked') {
        return { error: 'Browser is locked' };
      }

      return {
        error: `Unknown result: ${result.type}`
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Google login error';

      if (errorMessage.includes('timeout')) {
        return { error: 'Google login timeout, please retry' };
      }

      return {
        error: `Google login failed: ${errorMessage}`
      };
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    try {
      const unsubscribe = onAuthStateChanged(this.firebaseAuth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const authUser = this.mapFirebaseUserToAuthUser(firebaseUser);
            callback(authUser);
          } catch (error) {
            console.warn('[Template:FirebaseAuthService] Error in auth state change callback:', error);
            callback(null);
          }
        } else {
          callback(null);
        }
      });

      // Return unsubscribe function
      return unsubscribe;
    } catch (error) {
      console.error('[Template:FirebaseAuthService] Failed to set up auth state listener:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
