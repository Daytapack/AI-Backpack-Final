import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Profile.css'

function Profile() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const backendUrl = 'http://localhost:3000/users?ID=1';
    axios.get(backendUrl)
      .then((response) => {
        console.log('Fetched data', response.data);
        setProfileData(response.data[0][0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const handleEditProfile = (e) => {
    e.preventDefault();
    navigate('/Editprofile');
  };

  const renderProfile = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    return (
      <div className='profile'>
        <h2> Profile </h2>
        <p> <b> Name: </b>{profileData.Name}</p>
        <p> <b> Password: </b>{profileData.Password}</p>
        <p> <b>Education Level: </b>{profileData.Ed_Level}</p>
        <p> <b>Field: </b>{profileData.Field}</p>
        <p> <b>Bio:</b>{profileData.Bio}</p>
        <p> <b>Link Account:</b>{profileData.Link_Acct}</p>
        <p> <b>Organization: </b>{profileData.Organization}</p>
        <p> <b>Location: </b>{profileData.Location}</p>
        <p> <b>Username: </b>{profileData.Username}</p>
        <form onSubmit={handleEditProfile}>
          <button  className='edit-btn' type='submit'>Edit Profile</button>
        </form>
      </div>
    );
  };

  return (
    <div>

      {renderProfile()}
    </div>
  );
}

export default Profile;
