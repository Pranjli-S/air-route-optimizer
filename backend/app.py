from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import requests
from datetime import datetime
import os
# Import load_dotenv to read from a .env file
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- SECURITY UPDATE ---
# Instead of hardcoding, we fetch the key from environment variables.
# If the key isn't found, it defaults to None to prevent accidental exposure.
AVIATION_STACK_API_KEY = os.getenv('AVIATION_STACK_API_KEY')
AVIATION_STACK_BASE_URL = 'http://api.aviationstack.com/v1'

# Load the airport dataset
def load_airports():
    try:
        # Ensure the path is correct relative to app.py
        df = pd.read_csv('in-airports.csv')
        # Filter only large and medium airports with scheduled service
        df = df[
            (df['type'].isin(['large_airport', 'medium_airport'])) & 
            (df['scheduled_service'] == 1)
        ]
        airports = []
        for _, row in df.iterrows():
            if pd.notna(row['iata_code']):
                airports.append({
                    'code': row['iata_code'],
                    'name': row['name'],
                    'location': f"{row['municipality']}, {row['region_name']}",
                    'latitude': float(row['latitude_deg']),
                    'longitude': float(row['longitude_deg']),
                    'safetyRating': 95,
                    'failureRate': 0.003
                })
        return airports
    except Exception as e:
        print(f"Error loading airports: {e}")
        return []

def fetch_aviation_data(endpoint, params=None):
    if not AVIATION_STACK_API_KEY:
        print("Error: AVIATION_STACK_API_KEY not found in environment variables.")
        return None

    try:
        url = f'{AVIATION_STACK_BASE_URL}/{endpoint}'
        params = params or {}
        params['access_key'] = AVIATION_STACK_API_KEY
        
        response = requests.get(url, params=params)
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
        return jsonify({'data': []})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather', methods=['GET'])
def get_weather():
    try:
        iata = request.args.get('iata')
        if not iata:
            return jsonify({'error': 'IATA code is required'}), 400
            
        params = {'query': iata, 'limit': 1}
        data = fetch_aviation_data('cities', params)
        
        if data and data.get('data'):
            city_data = data['data'][0]
            return jsonify({
                'temperature': city_data.get('weather', {}).get('temperature', 'N/A'),
                'conditions': city_data.get('weather', {}).get('description', 'N/A'),
                'wind_speed': city_data.get('weather', {}).get('wind', {}).get('speed', 'N/A'),
                'humidity': city_data.get('weather', {}).get('humidity', 'N/A')
            })
        return jsonify({'error': 'No weather data found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    try:
        dep_iata = request.args.get('departure')
        arr_iata = request.args.get('arrival')
        if not dep_iata or not arr_iata:
            return jsonify({'error': 'Both departure and arrival IATA codes are required'}), 400
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        params = {
            'dep_iata': dep_iata,
            'arr_iata': arr_iata,
            'flight_status': 'scheduled',
            'flight_date': current_date
        }
        
        data = fetch_aviation_data('flights', params)
        if not data or 'data' not in data:
            return jsonify({'data': [], 'message': 'No scheduled flights found'})
        
        schedules = []
        for flight in data['data']:
            if flight.get('flight_status') == 'scheduled':
                schedules.append({
                    'flight_number': flight.get('flight', {}).get('iata', 'N/A'),
                    'airline': flight.get('airline', {}).get('name', 'N/A'),
                    'departure': flight.get('departure', {}),
                    'arrival': flight.get('arrival', {})
                })
        return jsonify({'data': schedules, 'total': len(schedules)})
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)