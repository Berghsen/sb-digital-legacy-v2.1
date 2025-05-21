import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Google Sign-In Function (for use in your components) ---
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      alert(`Error signing in with Google: ${error.message}`); // Basic error display
      // Consider a more robust error handling mechanism in your UI
      return { error }; // Return the error for the component to handle
    } else {
      console.log('Redirecting to Google for sign-in...');
      // No need to do anything here, Supabase handles the redirect
      return { data };
    }
  } catch (error) {
        console.error("An unexpected error occurred:", error);
        alert(`An unexpected error occurred: ${error.message}`);
        return {error: {message: "An unexpected error occurred"}};
  }
};

export default supabase;
