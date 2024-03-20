import React, { useState } from 'react';
import axios from 'axios';
import searchblack from './images/searchblack.png'
import "./styles/Search.css";

function SearchSave({onSearchResults}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle client request and server reponse and change searchResults state
  const handleSearch = () => {

  if(searchQuery === ""){ return; }

    const userID = 1; 
    backendUrl = `http://localhost:3000/savedopportunity?userid=${userid}`;
    axios.get(backendUrl)
      .then((response) => {
        console.log('Fetched data:', response.data);
        //setSearchResults(response.data);
        onSearchResults(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };


  const handleClearSearch = () => {
    setSearchQuery('');

    // Request Community Page Data
    const backendUrl = `http://localhost:3000/communitydisplay`;
    axios.get(backendUrl)
    .then((response) => {
        console.log('Fetched data:', response.data);
        onSearchResults(response.data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
  }

  return (
    <div className='search'>
      <input
        id="searchField"
        type="text"
        placeholder="     Search for opportunities by name, job types, location..." // Adjust the placeholder text
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {/* Search Button  Button Functionality */}
      <button class="custom-button" onClick={handleSearch}> 
      <img src={searchblack} alt='Search' class="button-image"/> 
      </button>

      {/* Clear Search Button Functionality */}
      {searchQuery !== '' && (
        <button className="clear-button" onClick={handleClearSearch}>
        Clear Search
        </button>
      )}
    </div>
  );
}

export default SearchSave;