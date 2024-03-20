import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles/Editprofile.css"

function EditProfile() {
  const [initialData, setInitialData] = useState({
    name: '',
    username: '',
    password: '',
    educationLevel: '',
    careerField: '',
    bio: '',
    linkAccount: '',
    organization: '',
    location: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    educationLevel: '',
    careerField: '',
    bio: '',
    linkAccount: '',
    organization: '',
    location: '',
});
  const [startDisplayInfo, setStartDisplayInfo] = useState(false);
  const navigate = useNavigate();
  const [startFetchData, setStartFetchData] = useState(false);
  useEffect(() => {
    handleFetchData();
  },[]);

  const handleFetchData = () => {
    console.log("I am in Fetch Data Place!!!");
    // Send Request to Fetch User Data
    const ID = 1;
    const backendUrl = `http://localhost:3000/users?ID=${ID}`;
    axios.get(backendUrl) 
      .then((response) => {
        const profileInfo = response.data[0][0];
        setInitialData(profileInfo);
        setFormData(profileInfo);
        setStartFetchData(false);
      })
      .catch((error) => {
        console.error('Error fetching profile data: ', error);
        setStartFetchData(false);
      });
  }

  const handleDisplayData = () => {
    console.log("I am in Display Data Place!!!");
    console.log("Initial Data Content After Press Button:", initialData);
    setFormData(initialData); // Reset All value to be default
    setStartDisplayInfo(false);
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    console.log("Initial Data Content BEFORE Press Button:", initialData);

    // Prevent to Refresh Input
    e.preventDefault();
    navigate('/Profile');

    // Store fields that are changed
    const ID = 1;
    const updatedData = Object.entries(formData)
      .filter(([key, value]) => value !== initialData[key])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    updatedData.ID = ID;

    console.log("User Updated Profile Data:", updatedData);

    // Send Request to Backend
    const backendUrl = 'http://localhost:3000/users/update';
    axios.patch(backendUrl, 
      updatedData,
      { headers: {
          'Content-Type': 'application/json',
      }}
    )
    .then((response) => {
      console.log(response.data);
      setStartDisplayInfo(true);
      setStartFetchData(true);
      handleFetchData();
    })
    .catch((error) => {
      console.error('Error updating profile: ', error);
    });
  
  };

  return (
    <div className='editprofile'>

      { startDisplayInfo && handleDisplayData() }
      { startFetchData && handleFetchData() }

      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="educationLevel">Education Level:</label>
          <input type="text" id="educationLevel" name="educationLevel" value={formData.educationLevel} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="careerField">Career Field:</label>
          <input type="text" id="careerField" name="careerField" value={formData.careerField} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="linkAccount">Link Account:</label>
          <input type="text" id="linkAccount" name="linkAccount" value={formData.linkAccount} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="organization">Organization:</label>
          <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div className='edit-btns'>
        <button className = "savebutton" type="submit">Save Changes</button>
        <button className = "closebutton" type="submit">Close</button>
        </div>

      </form>
    </div>
  );
}

export default EditProfile;