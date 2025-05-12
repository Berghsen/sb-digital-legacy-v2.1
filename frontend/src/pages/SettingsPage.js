import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const SettingsPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (!session) {
    return <div>Not authenticated. Redirecting...</div>;
  }

  return (
    <div>
      <h1>Settings</h1>
      <p>User ID: {session?.user?.id}</p>
      {/* Add your settings form and functionality here */}
      <button onClick={goToDashboard}>Back to Dashboard</button>
    </div>
  );
};

export default SettingsPage;