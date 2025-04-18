import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons
import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);

    try {
      const response = await axios.post("http://localhost:8000/", { email, password });
      const data = response.data;

      if (data.status === "exist") {
        const userName = data.name; // Capture the username from the response
        console.log("User name:", userName);
        
        // Pass both email and userName to the /bot route
        history("/bot", { state: { id: email, name: userName } });
      } else if (data === "notexist") {
        alert("User has not signed up or incorrect credentials");
      } else if (data === "incorrect") {
        alert("Incorrect password or username");
      }
    } catch (e) {
      alert("Wrong details");
      console.log(e);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="auth-container">
      <div className={`glass-card ${isAnimating ? 'animate-submit' : ''}`}>
        <div className="auth-header">
          <LogIn className="auth-icon" />
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={{ width: '335px' }} // Keep the width of the input field
            />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ width: '335px' }} // Keep the width of the input field
            />
            {/* Eye icon to toggle password visibility */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? <EyeOff /> : <Eye />} {/* Show eye or eye-off icon */}
            </span>
          </div>

          <button type="submit" className="submit-btn" disabled={isAnimating}>
            {isAnimating ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? Please join us at NutriMap & Smart Comparision{' '}
          <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
