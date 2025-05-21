import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import supabase from '../supabaseClient';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { signInWithGoogle } from '../supabaseClient';
// Corrected relative path, please verify THIS IS CORRECT in your project
import CountryDropdown from '../components/CountryDropdown';

const AccountPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(''); // Add country state
  const [countries, setCountries] = useState([]); // State for fetched countries
  const [fetchError, setFetchError] = useState(null); // State for fetch errors
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [updateEmailError, setUpdateEmailError] = useState(null);
  const [updateEmailSuccess, setUpdateEmailSuccess] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedCountries = data.map((c) => ({ name: c.name.common, code: c.cca2 }));
        setCountries(formattedCountries);
      } catch (err) {
        setFetchError(err.message);
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) {
          setError(userError.message);
          return;
        }
        if (user) {
          setUser(user);
          setFirstName(user.user_metadata?.first_name || '');
          setLastName(user.user_metadata?.last_name || '');
          setPhone(user.user_metadata?.phone || '');
          setCountry(user.user_metadata?.country || ''); // Load country
          const sessionData = await supabase.auth.getSession();
          setIsGoogleUser(sessionData?.data?.user?.identities?.some(id => id.provider === 'google') || false);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleUpdateProfile = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          country: country, // Save country
        },
      });
      if (updateError) {
        setUpdateError(updateError.message);
        return;
      }
      setUpdateSuccess('Profile updated successfully!');
      setUser(prevUser => ({
        ...prevUser,
        user_metadata: {
          ...prevUser.user_metadata,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          country: country,
        },
      }));
    } catch (err) {
      setUpdateError(err.message);
      console.error('Error updating profile:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    setUpdateEmailLoading(true);
    setUpdateEmailError(null);
    setUpdateEmailSuccess(null);
    if (!newEmail) {
      setUpdateEmailError('Please enter a new email address.');
      setUpdateEmailLoading(false);
      return;
    }

    try {
      const { error: updateEmailError } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (updateEmailError) {
        setUpdateEmailError(updateEmailError.message);
        return;
      }
      setUpdateEmailSuccess('Verification email sent to your new address. Please confirm to update.');
      setNewEmail('');
    } catch (err) {
      setUpdateEmailError(err.message);
      console.error('Error updating email:', err);
    } finally {
      setUpdateEmailLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setError(null);
    try {
      const { error: googleSignInError } = await signInWithGoogle();
      if (googleSignInError) {
        setError(googleSignInError.message);
        console.error('Error signing in with Google:', googleSignInError);
      } else {
        console.log('Redirecting to Google for sign-in...');
      }
    } catch (err) {
      setError('Unexpected error during Google sign in');
      console.error('Unexpected error', err);
    }
  };

  if (!session) {
    return <div>Not authenticated. Redirecting...</div>;
  }
  if (loading && !countries.length && !fetchError) {
    return <div>Loading user data and countries...</div>;
  }
  if (fetchError) {
    return <div>Error fetching countries: {fetchError}</div>;
  }

  return (
    <div>
      <h1>My Account</h1>
      <p>User ID: {session?.user?.id}</p>

      <div>
        <h2>Update Profile</h2>
        <FormInput
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FormInput
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
        <Button onClick={handleUpdateProfile} disabled={updateLoading}>
          {updateLoading ? 'Updating...' : 'Update Profile'}
        </Button>
        {updateError && <p className="error">{updateError}</p>}
        {updateSuccess && <p className="success">{updateSuccess}</p>}
      </div>

      <div>
        <h2>Update Email</h2>
        <p>Current Email: {session?.user?.email}</p>
        {isGoogleUser ? (
          <p>
            You cannot change your email address because you are logged in with a
            <a
              href="https://myaccount.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account
            </a>.
          </p>
        ) : (
          <>
            <FormInput
              type="email"
              placeholder="New Email Address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button
              onClick={handleUpdateEmail}
              disabled={updateEmailLoading}
            >
              {updateEmailLoading ? 'Sending Verification...' : 'Update Email'}
            </Button>
            {updateEmailError && <p className="error">{updateEmailError}</p>}
            {updateEmailSuccess && (
              <p className="success">{updateEmailSuccess}</p>
            )}
          </>
        )}
      </div>
      <button onClick={goToDashboard}>Back to Dashboard</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AccountPage;
