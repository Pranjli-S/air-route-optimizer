  import React, { useState, useEffect } from 'react';

function AirportSelector({ label, value, onChange, icon }) {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/airports')
      .then(response => response.json())
      .then(data => {
        setAirports(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching airports:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading airports...</div>;
  }

  

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none 
                   focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white border
                   shadow-sm"
        >
          <option value="">Select an airport</option>
          {airports.map((airport) => (
            <option key={airport.code} value={airport.code}>
              {airport.code} - {airport.name} ({airport.location}) - Safety: {airport.safetyRating}%
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AirportSelector;