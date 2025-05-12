import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { supabase } from '../supabaseClient'; // Import your Supabase client

const DashboardPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      alert('Failed to logout.');
    } else {
      console.log('User signed out.');
      navigate('/login'); // Redirect to the login page after successful logout
    }
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  if (!session) {
    return <div>Not authenticated. Redirecting...</div>;
  }

  return (
    <div>
      <h1>Welcome to your Dashboard, {session?.user?.email}!</h1>
      <p>User ID: {session?.user?.id}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={goToSettings}>Go to Settings</button>
      {/* Add other dashboard content here */}
    </div>
  );
};

export default DashboardPage;