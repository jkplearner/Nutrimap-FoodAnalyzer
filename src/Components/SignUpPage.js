import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons
import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsAnimating(false);
      return;
    }

    try {
      await axios.post("http://localhost:8000/signup", { name, email, password })
        .then(res => {
          if (res.data === "exist") {
            alert("User  already exists");
          } else if (res.data === "success") {
            history("/login", { state: { id: email } });
          }
        });
    } catch (e) {
      alert("Error: " + e.message);
      console.error(e);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="auth-container">
      <div className={`glass-card ${isAnimating ? 'animate-submit' : ''}`}>
        <div className="auth-header">
          <User  className="auth-icon" />
          <h2>Create Account</h2>
          <p>Join us today!</p>
          <p>NutriScope helps you make healthier food choices by providing detailed nutritional information and product analysis.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User  className="input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
              style={{ width: '335px' }} // Keep the width of the input field
            />
          </div>

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

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              style={{ width: '335px' }} // Keep the width of the input field
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform : 'translateY(-50%)',
                cursor: 'pointer',
              }}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />} {/* Show eye or eye-off icon */}
            </span>
          </div>

          <button type="submit" className="submit-btn" disabled={isAnimating}>
            {isAnimating ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;