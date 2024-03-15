import React, { useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./styles/Filter.css";

// Filter component definition
function Filter({ onFilterChange }) {
  // State for the selected date and calendar visibility
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

      // Define useState
      const [selectedMonth, setSelectedMonth] = useState('');
      const [showDropdown, setShowDropdown] = useState(false);
  
      // Map Month to Value
      const months = [
          { name: 'January'   , value: '01' },
          { name: 'February'  , value: '02' },
          { name: 'March'     , value: '03' },
          { name: 'April'     , value: '04' },
          { name: 'May'       , value: '05' },
          { name: 'June'      , value: '06' },
          { name: 'July'      , value: '07' },
          { name: 'August'    , value: '08' },
          { name: 'September' , value: '09' },
          { name: 'October'   , value: '10' },
          { name: 'November'  , value: '11' },
          { name: 'December'  , value: '12' },
      ];
  
      // Handle request and response
      const handleMonthChange = (month) => {
          setSelectedMonth(month);
  
          const backendUrl = `http://localhost:3000/search/filtermonth?filterDate=${month.value}`;
          axios.get(backendUrl)
          .then((response) => {
              console.log('Filtered data:', response.data);
              onFilterChange(response.data);
          })
          .catch((error) => {
              console.error('Error fetching filtered data:', error);
          });
      };

  // Handler for date changes in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Format month and day for the backend URL
    const formattedMonth = `${date.getMonth() + 1}`.padStart(2, '0');
    const formattedDay = `${date.getDate()}`.padStart(2, '0');

    // Construct backend URL with filtering parameters
    const backendUrl = `http://localhost:3000/search/filterdate?filterMonth=${formattedMonth}&filterDay=${formattedDay}`;
    axios.get(backendUrl)
    .then((response) => {
        console.log('Filtered data:', response.data);
        onFilterChange(response.data);
    })
    .catch((error) => {
        console.error('Error fetching filtered data:', error);
    });
  };

      // Handle Reset
      const handleReset = () => {
        setSelectedMonth('');
        setShowDropdown(false); // Close the dropdown when reset is clicked
        setSelectedDate('');
        setShowCalendar(false); // Close the dropdown when reset is clicked

        // Request Community Page Data
        const backendUrl = `http://localhost:3000/communitydisplay`;
        axios.get(backendUrl)
        .then((response) => {
            console.log('Fetched data:', response.data);
            onFilterChange(response.data);
        })
        // Fetch data from the backend using the constructed URL
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    };
    
  // Render the component
  return (
    <div className="filter-container">
      {/* Button to toggle calendar visibility */}
      <button className="filter-button" onClick={() => setShowCalendar(!showCalendar)}>
        Filter by Date
        {selectedDate && `: ${selectedDate.toLocaleDateString()}`}
      </button>

      {/* Render the calendar if showCalendar is true */}
      {showCalendar && (
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            showNeighboringMonth={false}
          />
        </div>
      )}

      {/* Render reset button if a date is selected */}
      {selectedDate && (
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      )}


                  {/* Filter Button Functionality */}
                  <button className="filter-button" onClick={() => setShowDropdown(!showDropdown)}>
                Filter by Month
                {selectedMonth && `: ${selectedMonth.name}`}
            </button>

            {/* Show DropDown Menu of Month */}
            {showDropdown && 
                (<div className="filter-dropdown">
                    {months.map((month) => (
                        <div key={month.value} onClick={() => handleMonthChange(month)}>
                            {month.name}
                        </div>
                    ))}
                </div>)
            }  

            {/* Reset Button Functionality */}
            {selectedMonth && (
                <button className="reset-button" onClick={handleReset}>
                    Reset
                </button>)
            }

    </div>


  );
}

// Export the Filter component as the default export
export default Filter;
