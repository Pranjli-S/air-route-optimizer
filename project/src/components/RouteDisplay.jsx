import React from 'react';
import { Plane, ArrowRight, Shield, Clock, AlertTriangle } from 'lucide-react';

function RouteDisplay({ route }) {
  if (!route) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-500 text-center">Select airports and find a route to see details</p>
      </div>
    );
  }

  const isSafestRoute = route.safetyRating >= 90;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Route Details</h2>
        {isSafestRoute && (
          <div className="flex items-center text-green-600">
            <Shield className="w-5 h-5 mr-2" />
            <span className="font-medium">Safest Route</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
        {route.path.map((stop, index) => (
          <React.Fragment key={stop}>
            <div className={`flex items-center justify-center rounded-lg p-3 ${
              isSafestRoute ? 'bg-green-100' : 'bg-indigo-100'
            }`}>
              <Plane className={`w-5 h-5 ${isSafestRoute ? 'text-green-600' : 'text-indigo-600'}`} />
              <span className={`ml-2 font-medium ${isSafestRoute ? 'text-green-800' : 'text-indigo-800'}`}>{stop}</span>
            </div>
            {index < route.path.length - 1 && (
              <ArrowRight className={`w-5 h-5 ${isSafestRoute ? 'text-green-400' : 'text-gray-400'} flex-shrink-0`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Distance</div>
          <div className="text-lg font-semibold text-gray-900">{route.distance} miles</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Safety Rating</div>
          <div className={`text-lg font-semibold ${isSafestRoute ? 'text-green-600' : 'text-gray-900'}`}>
            {route.safetyRating}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Flight Time</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.floor(route.totalFlightTime)}h {Math.round((route.totalFlightTime % 1) * 60)}m
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-sm text-gray-500">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Failure Risk</span>
          </div>
          <div className={`text-lg font-semibold ${
            parseFloat(route.failureRisk) > 5 ? 'text-red-600' : 
            parseFloat(route.failureRisk) > 2 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {route.failureRisk}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteDisplay;