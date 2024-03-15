import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/Signup.css'
function Signup() {
  const [initialData, setInitialData] = useState({
    Name: '',
    Username: '',
    Password: '',
    Ed_Level: '',
    Field: '',
    Bio: '',
    Link_Acct: '',
    Organization: '',
    Location: '',
  });
  const [formData, setFormData] = useState({
    Name: '',
    Username: '',
    Password: '',
    Ed_Level: '',
    Field: '',
    Bio: '',
    Link_Acct: '',
    Organization: '',
    Location: '',
  });
  const [navigateHome, setNavigateHome] = useState(false);

  // Initialize the navigate function
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare Info for POST Request
    const reqData = formData;
    reqData.ID = 4;
    console.log(formData);
    const backendUrl = 'http://localhost:3000/users/create';
    // Send Request
    axios.post(backendUrl, {
      data: reqData,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response.data);
      setNavigateHome(true);
    })
    .catch((error) => {
      console.error('Error registering new user data:', error);
      console.log('Server Response:', error.response);
    })
    setFormData(initialData);
  };

  const handleNavigate = () => {
    // When Sign Up OR Sign In Successfully
    navigate('/Community');
    setNavigateHome(false);
  }

  return (
    <div className="signup-container">
      {navigateHome && handleNavigate()}
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className='signup-group'>
          <div className="form-row">
            <label htmlFor="fullname">Full Name</label>
            <input type="text" name="Name" id="fullname" required value={formData.Name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input type="text" name="Username" id="username" required value={formData.Username} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input type="text" name="Link_Acct" id="email" required value={formData.Link_Acct} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input type="password" name="Password" id="password" required value={formData.Password} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="edu-Level">Education Level</label>
            <input type="text" name="Ed_Level" id="edu-Level" required value={formData.Ed_Level} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="organization">School or Organization</label>
            <input type="text" name="Organization" id="organization" required value={formData.Organization} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="career-field">Career Field</label>
            <input type="text" name="Field" id="career-field" required value={formData.Field} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="location">Location</label>
            <input type="text" name="Location" id="location" required value={formData.Location} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
            <label htmlFor="bio">Bio</label>
            <textarea name="Bio" id="bio" required value={formData.Bio} onChange={handleChange}></textarea>
         </div>

        <button type="submit" className="signup-button" onSubmit={handleSubmit}>
          Sign Up
        </button>
        <p>Already have an account? <Link to="/">Log In</Link></p>
      </form>
    </div>
  );
}

export default Signup;