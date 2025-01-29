import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist session in local storage
    autoRefreshToken: true, // Automatically refresh tokens
    detectSessionInUrl: true, // Detect session in URL (e.g., after OAuth redirect)
  },
  global: {
    headers: {
      'x-application-name': 'msl-portal', // Custom header
    },
  },
  db: {
    schema: 'public', // Default schema
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Realtime event rate limit
    },
  },
});

// Save session to local storage
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  if (session) {
    localStorage.setItem('supabaseSession', JSON.stringify(session));
  } else {
    localStorage.removeItem('supabaseSession');
  }
});

// Restore session from local storage
const restoreSession = async () => {
  const savedSession = localStorage.getItem('supabaseSession');
  if (savedSession) {
    const { data: { session }, error } = await supabase.auth.setSession(JSON.parse(savedSession));
    if (error) {
      console.error('Error restoring session:', error);
    } else {
      console.log('Restored session:', session);
    }
  }
};

// Initialize session restoration on app load
restoreSession();

// Custom error handler
const handleError = (error: Error) => {
  console.error('Supabase error:', error);
  // You can add custom error handling here (e.g., show a notification to the user)
  return error;
};

// Custom retry handler
const handleRetry = async (error: Error, retryCount: number) => {
  if (retryCount < 3) {
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    await new Promise((resolve) => setTimeout(resolve, delay));
    return true;
  }
  return false;
};

// Wrapper function for Supabase requests with error handling and retries
export async function supabaseRequest<T>(
  request: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    const result = await request();
    return result;
  } catch (error) {
    handleError(error as Error);
    if (await handleRetry(error as Error, retryCount)) {
      return supabaseRequest(request, retryCount + 1);
    }
    throw error;
  }
}

// Add connection health check
export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

// Export the Supabase client
export { supabase };