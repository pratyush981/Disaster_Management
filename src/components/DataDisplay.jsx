import React, { useState } from 'react';
import './styles.css'; // Ensure the CSS file is imported

const DataDisplay = ({ data }) => {
    // Parse and sort data by date in descending order
    const sortedData = data
        .filter(item => item.Date) // Ensure Date is present
        .sort((a, b) => new Date(b.Date) - new Date(a.Date));

    // State for search input and dropdown filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDisasterType, setSelectedDisasterType] = useState('');

    // Get unique disaster types for dropdown
    const disasterTypes = Array.from(new Set(data.map(item => item.predicted_disaster).filter(Boolean)));

    // Filter data based on search term and selected disaster type
    const filteredData = sortedData.filter(item => {
        const matchesSearch = item.Tweet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.Location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDisasterType = selectedDisasterType ? item.predicted_disaster === selectedDisasterType : true;
        return matchesSearch && matchesDisasterType;
    });

    return (
        <div className="data-display-wrapper">
            <h2 className="data-display-header">Disaster Information</h2>

            {/* Search Bar */}
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search by location or tweet..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                {/* Dropdown Filter */}
                <select
                    value={selectedDisasterType}
                    onChange={e => setSelectedDisasterType(e.target.value)}
                    className="dropdown-filter"
                >
                    <option value="">All Disaster Types</option>
                    {disasterTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Display Filtered Data */}
            <div className="data-display-container">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <div key={index} className="data-item">
                            <h3>Disaster Type: {item.predicted_disaster}</h3>
                            <p><strong>Location:</strong> {item.Location}</p>
                            <p><strong>Date:</strong> {item.Date}</p>
                            <p><strong>Tweet:</strong> {item.Tweet}</p>
                        </div>
                    ))
                ) : (
                    <p>No data found for the given search or filter criteria.</p>
                )}
            </div>
        </div>
    );
};

export default DataDisplay;
