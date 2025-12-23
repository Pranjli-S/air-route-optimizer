from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import requests
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Aviation Stack API configuration
AVIATION_STACK_API_KEY = '536b3701d16bd5504c4e91e150828550'  # Replace with your actual API key
AVIATION_STACK_BASE_URL = 'http://api.aviationstack.com/v1'

# Load the airport dataset
def load_airports():
    try:
        df = pd.read_csv('in-airports.csv')
        # Filter only large and medium airports with scheduled service
        df = df[
            (df['type'].isin(['large_airport', 'medium_airport'])) & 
            (df['scheduled_service'] == 1)
        ]
        airports = []
        for _, row in df.iterrows():
            # Only include airports with valid IATA codes
            if pd.notna(row['iata_code']):
                airports.append({
                    'code': row['iata_code'],
                    'name': row['name'],
                    'location': f"{row['municipality']}, {row['region_name']}",
                    'latitude': float(row['latitude_deg']),
                    'longitude': float(row['longitude_deg']),
                    'safetyRating': 95,  # Default safety rating
                    'failureRate': 0.003  # Default failure rate
                })
        return airports
    except Exception as e:
        print(f"Error loading airports: {e}")
        return []

def fetch_aviation_data(endpoint, params=None):
    """Generic function to fetch data from Aviation Stack API"""
    try:
        url = f'{AVIATION_STACK_BASE_URL}/{endpoint}'
        params = params or {}
        params['access_key'] = AVIATION_STACK_API_KEY
        
        print(f'Fetching data from: {url} with params: {params}')
        response = requests.get(url, params=params)
        
        # Print response details for debugging
        print(f'Response status: {response.status_code}')
        print(f'Response headers: {response.headers}')
        print(f'Response content: {response.text[:500]}')
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching aviation data: {e}')
        return None

@app.route('/api/airports', methods=['GET'])
def get_airports():
    airports = load_airports()
    return jsonify(airports)

@app.route('/api/flights/live', methods=['GET'])
def get_live_flights():
    """Get live flight data for specific airports"""
    try:
        dep_iata = request.args.get('departure')
        arr_iata = request.args.get('arrival')
        
        if not dep_iata or not arr_iata:
            return jsonify({'error': 'Both departure and arrival IATA codes are required'}), 400
        
        params = {
            'dep_iata': dep_iata,
            'arr_iata': arr_iata,
            'limit': 10,
            'flight_status': 'active'
        }
        
        data = fetch_aviation_data('flights', params)
        if not data:
            return jsonify({'error': 'Unable to fetch flight data'}), 500
            
        # Extract relevant flight information
        if data.get('data'):
            flights = [{
                'flight_number': flight.get('flight', {}).get('iata', 'N/A'),
                'airline': flight.get('airline', {}).get('name', 'N/A'),
                'status': flight.get('flight_status', 'N/A'),
                'departure_time': flight.get('departure', {}).get('scheduled', 'N/A'),
                'arrival_time': flight.get('arrival', {}).get('scheduled', 'N/A'),
                'delay': flight.get('departure', {}).get('delay', 'N/A')
            } for flight in data['data']]
            return jsonify({'data': flights})
        else:
            return jsonify({'data': []})
    except Exception as e:
        print(f'Error in get_live_flights: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather information for an airport"""
    try:
        iata = request.args.get('iata')
        if not iata:
            return jsonify({'error': 'IATA code is required'}), 400
            
        # For weather, we need to use the cities endpoint with the IATA code
        params = {
            'query': iata,
            'limit': 1
        }
        
        data = fetch_aviation_data('cities', params)
        if not data:
            return jsonify({'error': 'Unable to fetch weather data'}), 500
            
        # Extract relevant weather information from the response
        if data.get('data') and len(data['data']) > 0:
            city_data = data['data'][0]
            weather_info = {
                'temperature': city_data.get('weather', {}).get('temperature', 'N/A'),
                'conditions': city_data.get('weather', {}).get('description', 'N/A'),
                'wind_speed': city_data.get('weather', {}).get('wind', {}).get('speed', 'N/A'),
                'humidity': city_data.get('weather', {}).get('humidity', 'N/A')
            }
            return jsonify(weather_info)
        else:
            return jsonify({'error': 'No weather data found for this airport'}), 404
    except Exception as e:
        print(f'Error in get_weather: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    """Get flight schedules between airports"""
    try:
        dep_iata = request.args.get('departure')
        arr_iata = request.args.get('arrival')
        
        print(f'Getting schedules for {dep_iata} to {arr_iata}')
        
        if not dep_iata or not arr_iata:
            return jsonify({'error': 'Both departure and arrival IATA codes are required'}), 400
        
        # Get current date in YYYY-MM-DD format
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        params = {
            'access_key': AVIATION_STACK_API_KEY,
            'dep_iata': dep_iata,
            'arr_iata': arr_iata,
            'flight_status': 'scheduled',
            'flight_date': current_date
        }
        
        # Make direct request to handle potential redirect issues
        url = f'{AVIATION_STACK_BASE_URL}/flights'
        print(f'Making request to: {url}')
        print(f'With params: {params}')
        
        response = requests.get(url, params=params)
        print(f'Response status: {response.status_code}')
        print(f'Response headers: {response.headers}')
        print(f'Response content: {response.text[:500]}')
        
        if response.status_code != 200:
            return jsonify({
                'error': f'API request failed with status {response.status_code}',
                'details': response.text
            }), 500
        
        data = response.json()
        if not data or 'data' not in data:
            return jsonify({'data': [], 'message': 'No scheduled flights found'})
        
        # Extract relevant schedule information
        schedules = []
        for flight in data['data']:
            if flight.get('flight_status') == 'scheduled':
                schedule = {
                    'flight_number': flight.get('flight', {}).get('iata', 'N/A'),
                    'airline': flight.get('airline', {}).get('name', 'N/A'),
                    'departure': {
                        'scheduled': flight.get('departure', {}).get('scheduled', 'N/A'),
                        'terminal': flight.get('departure', {}).get('terminal', 'N/A')
                    },
                    'arrival': {
                        'scheduled': flight.get('arrival', {}).get('scheduled', 'N/A'),
                        'terminal': flight.get('arrival', {}).get('terminal', 'N/A')
                    }
                }
                schedules.append(schedule)
        
        return jsonify({
            'data': schedules,
            'total': len(schedules)
        })
        
    except requests.exceptions.RequestException as e:
        print(f'Request error in get_schedules: {str(e)}')
        return jsonify({
            'error': 'Failed to connect to flight data service',
            'details': str(e)
        }), 500
    except Exception as e:
        print(f'Unexpected error in get_schedules: {str(e)}')
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
