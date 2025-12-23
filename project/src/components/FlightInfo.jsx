import React, { useState, useEffect } from 'react';
import { Cloud, Clock, Plane } from 'lucide-react';

const FlightInfo = ({ sourceAirport, destinationAirport }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate some sample flight data since we're limited by API
  const generateSampleFlights = (source, destination) => {
    const times = ['06:00', '09:30', '13:45', '16:20', '19:00'];
    const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara'];
    
    return times.map((time, index) => ({
      flight_number: `${airlines[index % airlines.length].substring(0, 2)}${100 + index}`,
      airline: airlines[index % airlines.length],
      departure: {
        scheduled: `2025-05-27T${time}:00+05:30`,
        terminal: String.fromCharCode(65 + (index % 3))
      },
      arrival: {
        scheduled: `2025-05-27T${time.split(':').map((t, i) => i === 0 ? String(Number(t) + 2).padStart(2, '0') : t).join(':')}:00+05:30`,
        terminal: String.fromCharCode(65 + ((index + 1) % 3))
      },
      status: Math.random() > 0.8 ? 'Delayed' : 'On Time',
      delay: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0
    }));
  };

  useEffect(() => {
    if (sourceAirport && destinationAirport) {
      fetchData();
    }
  }, [sourceAirport, destinationAirport]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate sample flight data
      const sampleFlights = generateSampleFlights(sourceAirport, destinationAirport);
      
      // Simulate weather data since API access is restricted
      const weatherData = {
        source: {
          temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
          conditions: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
          wind_speed: Math.floor(Math.random() * 20) + 5,
          humidity: Math.floor(Math.random() * 30) + 50
        },
        destination: {
          temperature: Math.floor(Math.random() * 15) + 20,
          conditions: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
          wind_speed: Math.floor(Math.random() * 20) + 5,
          humidity: Math.floor(Math.random() * 30) + 50
        }
      };
      
      setWeather(weatherData);
      
      // Split sample flights into schedules and live flights
      const currentTime = new Date();
      const schedules = sampleFlights.filter(flight => 
        new Date(flight.departure.scheduled) > currentTime
      );
      const live = sampleFlights.filter(flight => 
        new Date(flight.departure.scheduled) <= currentTime
      );
      
      return {
        schedules,
        live
      };
    } catch (err) {
      setError('Failed to process flight information');
      console.error('Error processing flight info:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  if (!sourceAirport || !destinationAirport) {
    return null;
  }

  if (loading) {
    return (
      <div className="animate-pulse p-6 bg-white rounded-xl shadow-lg">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl shadow-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* Weather Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-blue-500" />
          Weather Conditions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">{sourceAirport}</h4>
            {weather?.source && (
              <p className="text-gray-600">
                Temperature: {weather.source.temperature}°C
                <br />
                Conditions: {weather.source.conditions}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-700">{destinationAirport}</h4>
            {weather?.destination && (
              <p className="text-gray-600">
                Temperature: {weather.destination.temperature}°C
                <br />
                Conditions: {weather.destination.conditions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Flight Schedules */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Flight Schedules
        </h3>
        <div className="space-y-2">
          {generateSampleFlights(sourceAirport, destinationAirport)
            .slice(0, 5)
            .map((schedule, index) => (
              <div key={index} className="text-sm border-b last:border-0 pb-2">
                <p className="font-medium text-gray-700">
                  {schedule.airline} {schedule.flight_number}
                </p>
                <p className="text-gray-600">
                  Departure: {new Date(schedule.departure.scheduled).toLocaleTimeString()}
                  <span className="text-xs ml-1">Terminal {schedule.departure.terminal}</span>
                  <br />
                  Arrival: {new Date(schedule.arrival.scheduled).toLocaleTimeString()}
                  <span className="text-xs ml-1">Terminal {schedule.arrival.terminal}</span>
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Live Flights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Plane className="w-5 h-5 mr-2 text-blue-500" />
          Live Status
        </h3>
        <div className="space-y-2">
          {generateSampleFlights(sourceAirport, destinationAirport)
            .slice(0, 3)
            .map((flight, index) => (
              <div key={index} className="text-sm border-b last:border-0 pb-2">
                <p className="font-medium text-gray-700">
                  {flight.airline} {flight.flight_number}
                </p>
                <p className="text-gray-600">
                  Status: <span className={flight.status === 'Delayed' ? 'text-orange-500' : 'text-green-500'}>
                    {flight.status}
                  </span>
                  {flight.status === 'Delayed' && (
                    <span className="text-orange-500 ml-1">
                      ({flight.delay} mins)
                    </span>
                  )}
                  <br />
                  ETA: {new Date(flight.arrival.scheduled).toLocaleTimeString()}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FlightInfo;
