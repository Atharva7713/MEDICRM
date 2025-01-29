import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  error: null,
  retryAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a session in localStorage first
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession?.currentSession) {
            setSession(parsedSession.currentSession);
            setUser(parsedSession.currentSession.user);
          }
        } catch (e) {
          console.warn('Error parsing stored session:', e);
        }
      }

      // Get fresh session
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      setSession(freshSession);
      setUser(freshSession?.user ?? null);
      setRetryCount(0); // Reset retry count on successful connection

      // Store session
      if (freshSession) {
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: freshSession,
          expiresAt: Date.now() + (freshSession.expires_in || 3600) * 1000
        }));
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(initializeAuth, RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        setError('Unable to connect to authentication service. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);

        // Update stored session
        if (session) {
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession: session,
            expiresAt: Date.now() + (session.expires_in || 3600) * 1000
          }));
        } else {
          localStorage.removeItem('supabase.auth.token');
        }
      } catch (err) {
        console.error('Error during auth state change:', err);
        setError('Authentication error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const retryAuth = async () => {
    setRetryCount(0);
    await initializeAuth();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={retryAuth}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, error, retryAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}