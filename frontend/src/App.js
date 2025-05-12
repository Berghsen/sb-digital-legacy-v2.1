import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage'; // Your protected page
import SettingsPage from './pages/SettingsPage'; // Import the new component

// Create a context to hold the user session
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
<AuthContext.Provider value={{ session }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              session ? <DashboardPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/settings"
            element={
              session ? <SettingsPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;