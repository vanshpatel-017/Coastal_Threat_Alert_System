import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CyclonePredictor() {
  const initialFormData = {
    latitude: 90,
    longitude: -1,
    pressure: 99971.414,
    wind_speed: 0.242155064,
    temperature: 21.56240936,
    pressure_gradient: 0,
    wind_direction: 88.22416118,
    wind_speed_rolling_avg: 0.242155064,
    temperature_rolling_avg: 21.56240936,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch weather data given coordinates (example with Open-Meteo)
  const fetchWeatherData = async (lat, lon) => {
    try {
      const weatherRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          hourly: 'surface_pressure',
        },
      });

      const { temperature, windspeed } = weatherRes.data.current_weather;
      const pressure = weatherRes.data.hourly.surface_pressure[0];

      // Update formData with live values (keep other fields as is or update accordingly)
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        temperature,
        pressure,
        wind_speed: windspeed,
        // You can update pressure_gradient, wind_direction, rolling averages if APIs available
      }));
    } catch (err) {
      console.error('Error fetching weather data:', err);
    }
  };

  // Get user location and fetch weather data on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherData(lat, lon);
        },
        () => {
          console.warn('Geolocation permission denied or unavailable.');
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPredictions([]);

    try {
      const payload = [
        Object.keys(formData).reduce((acc, key) => {
          acc[key] = parseFloat(formData[key]);
          return acc;
        }, {}),
      ];

      const res = await axios.post('http://localhost:3001/api/cyclone', payload);
      setPredictions(res.data.predictions);
    } catch (err) {
      setError('Prediction failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-6 bg-white rounded shadow mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Cyclone Threat Predictor</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {Object.entries(formData).map(([key, val]) => (
          <div key={key}>
            <label className="block text-gray-700">{key.replace(/_/g, ' ')}</label>
            <input
              type="number"
              name={key}
              value={val}
              onChange={handleChange}
              required
              step="any"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
        >
          {isLoading ? 'Predicting...' : 'Predict Cyclone'}
        </button>
      </form>

      {error && <div className="text-red-600 mt-4">{error}</div>}

      {predictions.length > 0 && (
        <div className="mt-4">
          <h3>Prediction Result:</h3>
          <ul>
            {predictions.map((pred, index) => (
              <li key={index} className="text-lg font-semibold">
                Threat Level: {pred === 1 ? 'Cyclone Detected' : 'No Cyclone'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
