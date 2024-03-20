// Backpack.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/BackPack.css';
import Search from './Search';
import OpportunityDetails from './OpportunityDetails'; // Import the Opp Detail component
import scholarship from './images/scholarship.png';
import internship from './images/internship.png';
import apprenticeship from './images/apprenticeship.png';
import mentorship from './images/mentorship.png';
import bootcamp from './images/bootcamp.png';

function BackPack(){
  // Define useState Hook
  const [savedOpportunities, setSavedOpportunities] = useState({
    Internships_Jobs: [],
    Apprenticeships: [],
    Mentorships: [],
    Scholarships: [],
    Bootcamps: [],
  });
  const categoryImages = {
    // All: null, // You can set a default image for the 'All' category or leave it as null
    Internships_Jobs: internship, // Add the appropriate image for 'Internships_Jobs' if needed
    Apprenticeships: apprenticeship, // Add the appropriate image for 'Apprenticeships' if needed
    Mentorships: mentorship, // Add the appropriate image for 'Mentorships' if needed
    Scholarships: scholarship, // Use the scholarship image for 'Scholarships'
    Bootcamps: bootcamp, // Add the appropriate image for 'Bootcamps' if needed
  };
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [opportunitiesToDisplay, setOpportunitiesToDisplay] = useState(10);
  const [clearOppToUpdate, setclearOppToUpdate] = useState(false);

  // Define useEffect Hook
  useEffect(() => {
    const userid = 1;
    const backendUrl = `http://localhost:3000/savedopportunity?userid=${userid}`;
    axios.get(backendUrl)
      .then((response) => {
        console.log('Fetched Saved Opp data:', response.data);
        setSavedOpportunities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching Saved Opp data:', error);
        setLoading(false);
      });
    //console.log(clearOppToUpdate);
    
    // Reset useRef
    setclearOppToUpdate(false);
  }, [clearOppToUpdate]);

  // Helper Function Used For Handle Search Results Function
  const searchResultsTableID = (tableName, searchResults) => {
    return searchResults[tableName].map(opp => opp['ID']);
  }

  const handleSearchResults = (searchResults) => {

    const filteredOpportunities = {
      Internships_Jobs: savedOpportunities['Internships_Jobs'].filter(opp => 
      {
        const InternshipsJobsIDs = searchResultsTableID('Internships_Jobs', searchResults);
        return InternshipsJobsIDs.includes(opp['ID']);
      }),
      Apprenticeships: savedOpportunities['Apprenticeships'].filter(opp => 
      {
        const ApprenticeshipsIDs = searchResultsTableID('Apprenticeships', searchResults);
        return ApprenticeshipsIDs.includes(opp['ID']);
      }),
      Mentorships: savedOpportunities['Mentorships'].filter(opp => 
      {
        const MentorshipsIDs = searchResultsTableID('Mentorships', searchResults);
        return MentorshipsIDs.includes(opp['ID']);
      }),
      Scholarships: savedOpportunities['Scholarships'].filter(opp => 
      {
        const ScholarshipsIDs = searchResultsTableID('Scholarships', searchResults);
        return ScholarshipsIDs.includes(opp['ID']);
      }),
      Bootcamps: savedOpportunities['Bootcamps'].filter(opp => 
      {
        const BootcampsIDs = searchResultsTableID('Bootcamps', searchResults);
        return BootcampsIDs.includes(opp['ID']);
      }),
    };

    setSavedOpportunities(filteredOpportunities);
    setLoading(false);

    console.log("Matched Saved Data: ", filteredOpportunities);
  };

  const handleLoadMore = () => {
    setOpportunitiesToDisplay(opportunitiesToDisplay + 5);
  };

  const handleLearnMoreClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetails(true);
    console.log("Opp From Community To Opp detail:", opportunity);
  };


  const handleClearSavedOpportunities = (opportunity) => {
    // Prepare Info for DELETE request
    const data = {
      "userID": 1,
      "oppID": opportunity.ID,
      "table": opportunity.oppCategory,
    };
    const backendUrl = "http://localhost:3000/savedopportunity/deletesaved";
    axios.delete(backendUrl, {
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // Trigger useEffect to re-render saved opp
      setclearOppToUpdate(true);
      console.log(clearOppToUpdate)
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error deleting data:', error);
      setLoading(false);
    })
  };

  const renderOpportunities = () => {
    // Shown During Fetching Data
    if (loading) {
      return <p>Loading...</p>;
    }

    // Shown When Response Data Type is Not Object Type
    if (!savedOpportunities) {
      console.log("Categories type in Render Function: ", typeof(savedOpportunities));
      return <p>No saved opportunities yet.</p>;
    }

    // Show Category Button Text
    const allOpportunities = selectedCategory === 'All'
      ? Object.values(savedOpportunities).flat()
      : savedOpportunities[selectedCategory];

    // Store Opportunities For Opportunity Cards
    const savedOpportunitiesToShow = allOpportunities.slice(0, opportunitiesToDisplay);

    return (
      <div>
        {/* Create Category Buttons */}
        <div className='category-btn'>
          <button
            className={`btn-light ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {Object.keys(savedOpportunities).map((categoryName) => (
            <button
              className={`btn-light ${selectedCategory === categoryName ? 'active' : ''}`}
              key={categoryName}
              onClick={() => setSelectedCategory(categoryName)}
            >
              {categoryName === 'Internships_Jobs' ? 'Internships/Jobs' : categoryName}
            </button>
          ))}
        </div>         
        <div className='opp-container'>
          {savedOpportunitiesToShow.length > 0 ? (
            savedOpportunitiesToShow.map((opportunity, index) => (
              <div className='opp-card' key={index}>
                <h2>{opportunity.Name}</h2>
                {opportunity.Company && (
                  <p> Company: {opportunity.Company}</p>
                )}
                {opportunity.Organization && (
                  <p> Organization: {opportunity.Organization}</p>
                )}
                {opportunity.Location && (
                  <p> Location: {opportunity.Location}</p>
                )}
                {opportunity.Award && (
                  <p> Award: {opportunity.Award}</p>
                )}
                {opportunity.Certification && (
                  <p> Certification: {opportunity.Certification}</p>
                )}
                {opportunity.Deadline && (
                  <p>Deadline: {opportunity.Deadline.slice(0, 10)}</p>
                )}
                {categoryImages[opportunity.oppCategory] && (
                  <img src={categoryImages[opportunity.oppCategory]} alt={`${opportunity.oppCategory}`} className="category-img" />
                )}
                <div className="btn-container">
                  {/* Create Learn More & Clear Opp Button */}
                  <button className="learnmore-btn" onClick={() => handleLearnMoreClick(opportunity)}>
                    Learn More
                  </button>
                  <button className="clear-btn" onClick={() => handleClearSavedOpportunities(opportunity)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No saved opportunities yet.</p>
          )}
        </div>

        {/* Show Load More Button When There Are Opportunities */}
        {opportunitiesToDisplay < allOpportunities.length && (
          <button className="loadmore-btn" onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className='BackPack-page'>Saved Opportunities</h1>
      <Search onSearchResults={handleSearchResults} />

      {OpportunityDetails && showDetails && (
        <OpportunityDetails
          opportunity={selectedOpportunity}
          onClose={() => setShowDetails(false)}
        />
      )}

      {renderOpportunities()}
    </div>
  );
}

export default BackPack;