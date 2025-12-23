import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Shield, Route, Grape as Graph } from 'lucide-react';
import AirportSelector from './components/AirportSelector';
import RouteDisplay from './components/RouteDisplay';
import RouteGraph from './components/RouteGraph';
import FlightInfo from './components/FlightInfo';
import { findOptimalRoute, initializeRoutes } from './utils/dijkstra.jsx';

function App() {
  const [sourceAirport, setSourceAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [route, setRoute] = useState(null);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/airports')
      .then(response => response.json())
      .then(data => {
        setAirports(data);
        initializeRoutes(data);
      })
      .catch(error => console.error('Error fetching airports:', error));
  }, []);

  const handleFindRoute = () => {
    if (!sourceAirport || !destinationAirport) {
      alert('Please select both airports');
      return;
    }

    const result = findOptimalRoute(sourceAirport, destinationAirport);
    if (result) {
      setRoute(result);
    } else {
      alert('No route found between selected airports');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="navbar bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Plane className="text-indigo-600 w-6 h-6" />
            <span className="text-xl font-semibold text-gray-800">AirRoute Optimizer</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="search-card bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="search-title text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Route className="w-6 h-6 mr-2 text-indigo-600" />
            Find Optimal Route
          </h1>

          <div className="airport-selectors grid md:grid-cols-2 gap-6 mb-6">
            <AirportSelector
              label="Departure Airport"
              value={sourceAirport}
              onChange={setSourceAirport}
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
            />
            <AirportSelector
              label="Arrival Airport"
              value={destinationAirport}
              onChange={setDestinationAirport}
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
            />
          </div>

          <div className="action-buttons flex justify-between items-center">
            <button
              onClick={handleFindRoute}
              className="find-route-btn bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 
                       transition-colors flex items-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>Find Route</span>
            </button>

            <button
              onClick={() => setShowGraph(!showGraph)}
              className="toggle-graph-btn bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 
                       transition-colors flex items-center space-x-2"
            >
              <Graph className="w-5 h-5" />
              <span>Toggle Route Graph</span>
            </button>
          </div>
        </div>

        {/* Route Finding Section */}
        {route && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Route className="w-6 h-6 mr-2 text-indigo-600" />
                Optimal Route
              </h2>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 
                         transition-colors flex items-center space-x-2"
              >
                <Graph className="w-5 h-5" />
                <span>{showGraph ? 'Show Details' : 'Show Graph'}</span>
              </button>
            </div>

            {!showGraph ? (
              <RouteDisplay route={route} />
            ) : (
              <RouteGraph route={route} />
            )}
          </div>
        )}

        {/* Flight Information Section */}
        <FlightInfo
          sourceAirport={sourceAirport}
          destinationAirport={destinationAirport}
        />
      </main>
    </div>
  );
}

export default App;