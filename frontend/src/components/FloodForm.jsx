import React, { useState, useEffect } from "react";
import axios from "axios";

const FloodForm = () => {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    temperature: "",
    msl: "",
    wind_speed: "",
  });
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  // Fetch data from Open-Meteo APIs
  const fetchWeatherData = async (lat, lon) => {
    try {
      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: lat,
            longitude: lon,
            current_weather: true,
            hourly: "surface_pressure",
          },
        }
      );

      const { temperature, windspeed } = weatherRes.data.current_weather;
      const pressure = weatherRes.data.hourly.surface_pressure[0];

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        temperature: temperature,
        msl: pressure,
        wind_speed: windspeed,
      }));
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
  };

  // Get browser location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          fetchWeatherData(lat, lon);
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  const handlePredict = async () => {
    try {
      // Send formData wrapped in array as backend expects a list of records
      const res = await axios.post("http://localhost:5000/predict", [formData]);
      setPredictions(res.data.predictions);
      setError("");
    } catch (err) {
      setError("Prediction error: " + (err.response?.data?.error || err.message));
      setPredictions([]);
    }
  };

  return (
    <div>
      <h2>Flood Risk Prediction Form</h2>
      <form>
        <div>Latitude: {formData.latitude}</div>
        <div>Longitude: {formData.longitude}</div>
        <div>Temperature: {formData.temperature} °C</div>
        <div>Mean Sea Level Pressure: {formData.msl} hPa</div>
        <div>Wind Speed: {formData.wind_speed} m/s</div>
      </form>
      <button onClick={handlePredict}>Get Predictions</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {predictions.map((pred, idx) => (
          <li key={idx}>
            Prediction {idx + 1}: {pred}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FloodForm;
