import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Community.css';
import Search from './Search'; // Import the Search component
import Filter from './Filter'; // Import the Filter component
import OpportunityDetails from './OpportunityDetails'; // Import the Opp Detail component
import backpack from './images/backpack.png';
import scholarship from './images/scholarship.png'
import internship from './images/internship.png'
import apprenticeship from './images/apprenticeship.png'
import mentorship from './images/mentorship.png'
import bootcamp from './images/bootcamp.png'

function CommunityPage() {
    /*
    UseState:
    - categories: Array that store opportunities in different categories
    - loading: Boolean that determine if opportunities are loading
    - selectedCategory: String that represent categories
    - selectedOpportunity: Array that store specific opps to be shown in detail window
    - showDetails: Boolean that determine if detail window should be shown
    - opportunitesToDisplay: Numbers of Opps to be shown
    - showSaveDialog: Boolean that determine if saved messages to be displayed
    - savedOpportunityToShowDialog: Array that store saved opps to be shown in the dialog
    - shuffledOpp: Array that store teh randomize opps to be displayed in "ALL" tab

    UseEffect:
    - When Community Page is refreshed:
      - It fetched the opportunity data from the backend for displaying later
      - It randomized the opportunity to be display in "ALL" tab

    Object:
    - categoryImages: Dictionary that stores the mapping to the icon image of opportunity categories
  */

  // Define useState Hook
  const [categories, setCategories] = useState({
    Internships_Jobs: [],
    Apprenticeships: [],
    Mentorships: [],
    Scholarships: [],
    Bootcamps: [],
  });
  const categoryImages = {
    Internships_Jobs: internship,
    Apprenticeships: apprenticeship,
    Mentorships: mentorship,
    Scholarships: scholarship,
    Bootcamps: bootcamp,
  };
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [opportunitiesToDisplay, setOpportunitiesToDisplay] = useState(8);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedOpportunityToShowDialog, setSavedOpportunityToShowDialog] = useState(null);
  const [shuffledOpp, setShuffledOpp] = useState([]);

  // Define useEffect Hook
  useEffect(() => {
    const backendUrl = 'http://localhost:3000/communitydisplay';
    axios.get(backendUrl)
      .then((response) => {
        console.log('Fetched data:', response.data);
        setCategories(response.data);
        setLoading(false);
        setShuffledOpp(shuffleArray(Object.values(response.data).flat()));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSearchResults = (searchResults) => {
    setShuffledOpp(shuffleArray(Object.values(searchResults).flat()));
    setLoading(false);
  }

  const handleFilterChange = (filterResults) => {
    setShuffledOpp(shuffleArray(Object.values(filterResults).flat()));
    setCategories(filterResults)
    setLoading(false);
  }

  const handleLoadMore = () => {
    setOpportunitiesToDisplay(opportunitiesToDisplay + 4);
  };

  const handleLearnMoreClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetails(true);
    console.log("Opp From Community To Opp detail:", opportunity);
  };

  const handleSaveOpportunity = (opportunity) => {
    // Get Real Time Date for "data" element
    const currentDate = new Date();
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1);
    const date = String(currentDate.getDate());

    // Prepare Info for POST request
    const data = {
      "userID": 1,
      "oppID": opportunity.ID,
      "savedDate": `${year}-${month}-${date}`,
      "table": opportunity.oppCategory,
    };
    const backendUrl = 'http://localhost:3000/savedopportunity/addsaved';
    axios.post(backendUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error adding data:', error);
        setLoading(false);
      });

    // Set the saved opportunity to show in the dialog
    setSavedOpportunityToShowDialog(opportunity);

    // Show the save dialog
    setShowSaveDialog(true);

    // Optionally, you can close the dialog after a certain duration
    setTimeout(() => {
      setShowSaveDialog(false);
      setSavedOpportunityToShowDialog(null); // Reset saved opportunity after closing dialog
    }, 5000); // Close the dialog after 3 seconds 
  };
  
  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const renderOpportunities = () => {
    // Shown During Fetching Data
    if (loading) {
      return <p>Loading...</p>;
    }

    // Shown When Response Data Type is Not Object Type
    if (!categories) {
      console.log("Categories type in Render Function: ", typeof(categories));
      return <p>No data available</p>;
    }

    // Show Category Button Text
    const allOpportunities = selectedCategory === 'All'
    ? shuffledOpp
    : categories[selectedCategory];

    // Filter out opportunities with unavailable names
    const filteredOpportunities = allOpportunities.filter(opportunity => opportunity.Name !== 'unavailable');

    // const opportunitiesToShow = allOpportunities.slice(0,opportunitiesToDisplay);
    const opportunitiesToShow = filteredOpportunities.slice(0, opportunitiesToDisplay);

    return (
      <div>
        {/* Create Category Buttons */}
        <div className='category-buttons'>
          <button
            className={`btn-light ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {Object.keys(categories).map((categoryName) => (
            <button
              className={`btn-light ${selectedCategory === categoryName ? 'active' : ''}`}
              key={categoryName}
              onClick={() => setSelectedCategory(categoryName)}
            >
              {categoryName === 'Internships_Jobs' ? 'Internships/Jobs' : categoryName}
            </button>
          ))}
        </div>

        {/* Create Opportunity Card */}
        <div className="opportunity-container">
          {opportunitiesToShow.length > 0 ? (
            opportunitiesToShow.map((opportunity, index) => (
              <div className="opportunity-card" key={index}>
                {/* Display Relevant Info */}
                <h2>{opportunity.Name}</h2>
                {opportunity.Company && (
                  <p> <b>Company: </b> {opportunity.Company}</p>
                )}
                {opportunity.Organization && (
                  <p> <b>Organization: </b> {opportunity.Organization}</p>
                )}
                {opportunity.Location && (
                  <p> <b>Location: </b> {opportunity.Location}</p>
                )}
                {opportunity.Award && (
                  <p> <b>Award: </b> {opportunity.Award}</p>
                )}
                {opportunity.Certification && (
                  <p> <b>Certification: </b> {opportunity.Certification}</p>
                )}
                {opportunity.Deadline && (
                <p> <b>Deadline: </b> {opportunity.Deadline.slice(0, 10)}</p>
                )}
                {categoryImages[opportunity.oppCategory] && (
                  <img src={categoryImages[opportunity.oppCategory]} alt={`${opportunity.oppCategory}`} className="category-image" />
                )}
              <div className="buttons-container">
                  <button className="learnmore-button" onClick={() => handleLearnMoreClick(opportunity)}>Learn More</button>
                  <button className='Save-button' onClick={() => handleSaveOpportunity(opportunity)}>
                    <img src={backpack} alt="" />
                  </button>
                </div>

                {/* Save Dialog */}
                {showSaveDialog && savedOpportunityToShowDialog === opportunity && (
                  <div className="save-dialog">
                    <p>Your opportunity "{opportunity.Name}" was saved!</p>
                    <button onClick={() => setShowSaveDialog(false)}>Close</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No Information Found</p>
          )}
        </div>

        {/* Show Load More Button When There Are Opportunities */}
        {opportunitiesToDisplay < allOpportunities.length && (
          <button className="loadmore-button" onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </div>
    );
  };

  return (
    
    <div>
      <h1 className="community-page">Community Opportunities</h1>

      <Search onSearchResults={handleSearchResults} />

      <Filter onFilterChange={handleFilterChange} />

      {renderOpportunities()}

      {OpportunityDetails && showDetails && (
        <OpportunityDetails
          opportunity={selectedOpportunity}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  
  );
}

export default CommunityPage;