import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import supabase from '../supabaseClient';
import { signInWithGoogle } from '../supabaseClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const loginButtonRef = useRef(null); // Ref for the login button

  // Use useCallback to memoize handleLogin
  const handleLogin = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        console.log('Login successful:', data);
        navigate('/dashboard'); // Redirect to dashboard or any other page
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate]); // Add dependencies to useCallback

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        // Check if *either* the email or password input is focused.
        if (document.activeElement === emailInputRef.current || document.activeElement === passwordInputRef.current) {
          e.preventDefault();
          handleLogin();
        }
      }
    };

    // Attach the event listener to the input fields directly.
    if (emailInputRef.current) {
      emailInputRef.current.addEventListener('keydown', handleKeyDown);
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      // Detach the event listener when the component unmounts
      if (emailInputRef.current) {
        emailInputRef.current.removeEventListener('keydown', handleKeyDown);
      }
      if (passwordInputRef.current) {
        passwordInputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleLogin]);

  const handleSignInWithGoogle = async () => {
    setError(null);
    try {
      const { error: googleSignInError } = await signInWithGoogle();
      if (googleSignInError) {
        setError(googleSignInError.message);
      }
    } catch (err) {
      setError('Unexpected error occurred. Please try again.');
    }
  };


  return (
    <div>
      <h2>Log In</h2>
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        ref={emailInputRef} // Attach the ref
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        ref={passwordInputRef} // Attach the ref
      />
      <Button
        onClick={handleLogin}
        disabled={loading}
        ref={loginButtonRef} // Attach ref to the login button
      >
        {loading ? 'Loading...' : 'Log In'}
      </Button>
      <button onClick={handleSignInWithGoogle} disabled={loading}>
        Log In with Google
      </button>
      {error && <p>{error}</p>}
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
