import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/Login.css';
import email from './images/email.png'
import password from './images/password.png'

function Login() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    // After clicking the login button, navigate to the home page
    navigate('/Community');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email<img src={email} alt="" /></label>
          <input type="email" name="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password<img src={password} alt="" /></label>
          <input type="password" name="password" id="password" required />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
      
    </div>
  );
}

export default Login;