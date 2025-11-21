// @ts-nocheck
export * from './types';

// Firebase backend authentication system - BYOK implementation
export { useAuth } from './firebase/hook';
export { authService } from './firebase/service';
export { AuthProvider } from './firebase/context';

// Supabase backend authentication system
export * from './supabase';

// Mock backend authentication system - for prototype development and when backend is unavailable
export { useMockAuth, useMockAuthDebug } from './mock/hook';
export { mockAuthService } from './mock/service';
export { MockAuthRouter } from './mock/router';
export { MockAuthProvider } from './mock/context';
