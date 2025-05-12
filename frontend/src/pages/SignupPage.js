import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { supabase } from '../supabaseClient';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('Signup error:', error.message);
        alert(`Signup failed: ${error.message}`);
      } else {
        console.log('Signup successful:', data);
        alert('Signup successful! Check your email to confirm.');
        navigate('/login'); // Or a confirmation page
      }
    } catch (error) {
      console.error('Signup error:', error.message);
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSignup}>Sign Up</Button>
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  );
}

export default SignupPage;