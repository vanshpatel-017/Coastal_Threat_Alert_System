import React, { useState } from "react";
import axios from "../utils/axiosInstance";

const Predicted = ({ addAlert, city, setCity, metrics }) => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  const handlePredict = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("⚠ Please enter a location before prediction.");
      return;
    }

    if (!metrics.temp) {
      setError("⚠ Please fetch weather metrics for the city first.");
      return;
    }

    try {
      // Fetch coordinates for the city
      const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      if (!geoRes.data[0]) {
        throw new Error("City not found");
      }
      const { lat: Latitude, lon: Longitude } = geoRes.data[0];

      const inputData = {
        Latitude,
        Longitude,
        Elevation: metrics.elevation || 100, // Use NOAA sea level-based elevation
        Avg_Precipitation: metrics.rain || 0, // Use rainfall
        Coastal_Distance: 300, // Hardcoded, adjust based on data
        Historical_Floods: 1, // Hardcoded, adjust based on data
        Drainage_Capacity: 2, // Hardcoded, adjust based on data
        City: city,
      };

      console.log("Prediction input:", inputData);
      const res = await axios.post("/predict", [inputData]);
      setPredictions(res.data.predictions);
      setError("");

      const newAlert = {
        id: Date.now(),
        title: "Flood Risk Prediction",
        description:
          res.data.predictions[0] === 1
            ? "✅ Normal Condition"
            : "⚠ Flood Risk Detected!",
        location: city,
        sentAt: new Date().toISOString(),
      };

      if (addAlert) addAlert(newAlert);
    } catch (err) {
      console.error("Prediction error:", err.message, err.response?.data);
      setError("Prediction error: " + (err.response?.data?.message || err.message));
      setPredictions([]);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-3 font-poppins">Flood Risk Prediction</h2>
      <form onSubmit={handlePredict} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Enter location (e.g., Chennai)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border px-3 py-2 rounded w-full font-poppins"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-poppins"
        >
          Get Predictions
        </button>
      </form>
      {error && <div className="mt-2 text-red-600 font-poppins">{error}</div>}
      {predictions.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-bold mb-1 font-poppins">Prediction Result</h3>
          {predictions.map((pred, idx) => (
            <p key={idx} className="font-poppins">
              {city} → {pred === 1 ? "✅ Normal Condition" : "⚠ Flood Risk"}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Predicted;