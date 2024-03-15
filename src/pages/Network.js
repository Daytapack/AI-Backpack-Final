import React, { useState } from 'react';
import './styles/Network.css';
import profile1 from './profiles/profile1.png'
import profile2 from './profiles/profile2.png'
import profile3 from './profiles/profile3.png'
import profile4 from './profiles/profile4.png'
import profile5 from './profiles/profile5.png'
import profile6 from './profiles/profile6.png'


const profiles = [
  {
    name: 'Rodrigo Melendez',
    gradeLevel: 'undergraduate Senior',
    organization: 'University of California Merced',
    jobTitle: 'Student',
    profilePicture: profile1,
  },
  {
    name: 'Baixi Guo',
    gradeLevel: 'undergraduate Senior',
    organization: 'University of California Merced',
    jobTitle: 'Student',
    profilePicture: profile2,
  },
  {
    name: 'Leo Rozay',
    gradeLevel: 'Undergraduate Senior',
    organization: 'University of California Merce',
    jobTitle: 'Student',
    profilePicture: profile3,
  },
  {
    name: 'Ana Sanchez',
    gradeLevel: 'Undergraduate Senior',
    organization: 'University of California Merced',
    jobTitle: 'Student',
    profilePicture: profile4,
  },
  {
    name: 'Almadelia Duran',
    gradeLevel: 'Undergraduate 3rd year',
    organization: 'san Jose State University',
    jobTitle: 'Student',
    profilePicture: profile5,
  },
  {
    name: 'Andrea valdez',
    gradeLevel: 'Graduated student',
    organization: 'ABC Childcare',
    jobTitle: 'Assistant',
    profilePicture: profile6,
  },
  
  // Add more profiles as needed
];

const Network = () => {
  const [connectedProfileIndex, setConnectedProfileIndex] = useState(null);

  const toggleConnection = (index) => {
    if (connectedProfileIndex === index) {
      // If already connected, disconnect
      setConnectedProfileIndex(null);
    } else {
      // If not connected, show popup
      setConnectedProfileIndex(index);
    }
  };

  const profile = () => {
    return (
      <div className="profile-containers">
        {profiles.map((profile, index) => (
          <div className="profile-box" key={index}>
            <img src={profile.profilePicture} alt="" />
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p>Grade Level: {profile.gradeLevel}</p>
              <p>Organization: {profile.organization}</p>
              <p>Job Title: {profile.jobTitle}</p>
            </div>
            <button className='connectbtn' onClick={() => toggleConnection(index)}>
              {connectedProfileIndex === index ? 'Disconnect' : 'Connect'}
            </button>
            {connectedProfileIndex === index && (
              <div className="green-dot"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="Network"> Network</h1>
      {profile()}
    </div>
  );
};

export default Network;