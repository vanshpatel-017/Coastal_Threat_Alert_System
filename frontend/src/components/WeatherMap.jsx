import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function WeatherMap({ alerts }) {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
      {/* Base Map */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Weather Layers */}
      <LayersControl position="topright">
        <LayersControl.Overlay checked name="🌡 Temperature">
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="Weather data © OpenWeatherMap"
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="☁ Clouds">
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="Weather data © OpenWeatherMap"
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="💨 Wind">
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="Weather data © OpenWeatherMap"
          />
        </LayersControl.Overlay>
      </LayersControl>

      {/* Alerts Markers */}
      {alerts.map((alert) => (
        <Marker key={alert.id} position={[23.0225, 72.5714] /* Example coords, replace with real */}>
          <Popup>
            <b>{alert.title}</b><br />
            {alert.description}<br />
            <i>{alert.location}</i>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
