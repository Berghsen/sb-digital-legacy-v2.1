import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import supabase from '../supabaseClient'; // Import the default export
import { signInWithGoogle } from '../supabaseClient'; // Import the named export
import CountryDropdown from '../components/CountryDropdown';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]); // State to hold fetched countries
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedCountries = data.map((country) => ({
          name: country.name.common,
          code: country.cca2, // Optional: You can use the code if needed
        }));
        setCountries(formattedCountries);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            country: country, // Save the selected country
          },
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError.message);
        setError(signUpError.message);
      } else {
        console.log('Signup successful:', data);
        alert('Signup successful! Check your email to confirm.');
        navigate('/login'); // Or a confirmation page
      }
    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setError(null);
    try {
      const { error: googleSignInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (googleSignInError) {
        console.error('Error signing in with Google:', googleSignInError);
        setError(googleSignInError.message);
      } else {
        console.log('Redirecting to Google for sign-in...');
      }
    } catch (err) {
      setError('Unexpected error during Google sign in');
      console.error('Unexpected error', err);
    }
  };

  if (loading) {
    return <div>Loading countries...</div>;
  }

  if (fetchError) {
    return <div>Error fetching countries: {fetchError}</div>;
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <FormInput
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <FormInput
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <FormInput
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <FormInput
        type="tel"
        placeholder="Phone Number (Optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <CountryDropdown
        label="Country"
        value={country}
        onChange={handleCountryChange}
        countries={countries}
      />
      <Button onClick={handleSignup} disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}

export default SignupPage;
