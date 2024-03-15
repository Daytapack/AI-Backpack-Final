import React, { useState, useEffect } from 'react';
import './Navbar.css';

import logo from '../images/conectado.png';
import networking_icon from '../images/networking.png';
import backpack_icon from '../images/backpack.png';
import editprofile_icon from '../images/edit_profile.png';
import home_icon from '../images/community.png';
import logout from '../images/Logout.png'
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [menu, setMenu] = useState(getMenuFromPathname(location.pathname));

  useEffect(() => {
    setMenu(getMenuFromPathname(location.pathname));
  }, [location.pathname]);

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className='Navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='' />
        <p>Welcome to your Land of Opportunities</p>
      </div>
      <ul className='nav-menu'>
        <li className="menu-item">
          <Link to='/Community' className={menu === 'Community' ? 'active-button circular-button' : 'inactive-button circular-button'}>
            <img src={home_icon} alt='' />
          </Link>
          <p>Community</p>
        </li>
        <li className="menu-item">
          <Link to='/BackPack' className={menu === 'BackPack' ? 'active-button circular-button' : 'inactive-button circular-button'}>
            <img src={backpack_icon} alt='' />
          </Link>
          <p>Backpack</p>
        </li>
        <li className="menu-item">
          <Link to='/Network' className={menu === 'Network' ? 'active-button circular-button' : 'inactive-button circular-button'}>
            <img src={networking_icon} alt='' />
          </Link>
          <p>Network</p>
        </li>
        <li className="menu-item">
          <Link to='/Profile' className={menu === 'Profile' ? 'active-button circular-button' : 'inactive-button circular-button'}>
            <img src={editprofile_icon} alt='' />
          </Link>
          <p>Profile</p>
        </li>
        <li className="menu-item">
          <button onClick={handleLogout} className='inactive-button circular-button'>
            <img src={logout} alt='' />
          </button>
          <p>Logout</p>
        </li>
      </ul>
    </div>
  );
}

function getMenuFromPathname(pathname) {
  switch (pathname) {
    case '/Community':
      return 'Community';
    case '/BackPack':
      return 'BackPack';
    case '/Network':
      return 'Network';
    case '/Profile':
      return 'Profile';
    default:
      return '';
  }
}

export default Navbar;
