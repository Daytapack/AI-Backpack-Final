import React from 'react';
import './styles/OpportunityDetail.css';

function OpportunityDetails({ opportunity, onClose }) {
    if (!opportunity){
      return <div> No Information Available </div>;
    }

  return (
    <div className="OpportunityDetails">
      <dialog className="DetailWindow" open={!!opportunity} onClose={onClose}>
        {/* Display Relevant Info */}
        <h2>{opportunity.Name}</h2>
        {opportunity.Job_Type && (
          <p> Job Type: {opportunity.Job_Type} </p>
        )}
        {opportunity.Wage && (
          <p> Wage: {opportunity.Wage} </p>
        )}
        {opportunity.Ed_Level && (
          <p> Education Level: {opportunity.Ed_Level} </p>
        )}
         {opportunity.Reqs && (
          <p> Requirement: {opportunity.Reqs} </p>
        )}
        {opportunity.Pricing && (
          <p> Pricing: {opportunity.Pricing}</p>
        )}
        {opportunity.Details && (
          <p> Detail: {opportunity.Details} </p>
        )}
        {opportunity.URL && (
          <p> <a href={opportunity.URL}> Website Link </a> </p>
        )}

        {/* Show Close button */}
        <button className="close-button" onClick={onClose}>Close</button>
      </dialog>
    </div>
  );
}

export default OpportunityDetails;