import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AlertForm from "./AlertForm";
import WeatherMap from "../components/WeatherMap";
import Alert from '@mui/material/Alert';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);
  const navigate = useNavigate();

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Get user's current location and set default city
  useEffect(() => {
    const getDefaultCity = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
              if (!apiKey) {
                throw new Error("OpenWeatherMap API key is missing");
              }
              const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
              );
              const cityName = response.data[0]?.city || response.data[0]?.name || "";
              if (cityName) {
                setCity(cityName);
                fetchMetrics(cityName);
              } else {
                setCity("Ahmedabad");
                fetchMetrics("Ahmedabad");
              }
            } catch (err) {
              console.error("Error getting city from coordinates:", err);
              setCity("Ahmedabad");
              fetchMetrics("Ahmedabad");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setCity("Ahmedabad");
            fetchMetrics("Ahmedabad");
          }
        );
      } else {
        setCity("Ahmedabad");
        fetchMetrics("Ahmedabad");
      }
    };
    getDefaultCity();
  }, []);

  

  // Fetch weather metrics
  const fetchMetrics = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("OpenWeatherMap API key is missing");
      }
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: cityName.trim(),
            appid: apiKey,
            units: "metric",
          },
        }
      );
      const weather = weatherRes.data;
      let seaLevel = "N/A";
      try {
        const seaLevelRes = await axios.get("/api/data/sea-level");
        seaLevel = seaLevelRes.data?.data?.[0]?.v || 0;
      } catch (err) {
        console.error("Sea level API error:", err);
      }
      setMetrics({
        temp: weather.main.temp,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind.speed,
        windDirection: weather.wind.deg,
        rain: weather.rain ? weather.rain["1h"] : 0,
        seaLevel: weather.main.sea_level || seaLevel,
      });
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle city search
  const handleSearchCity = async () => {
    if (!city.trim()) {
      alert("Please enter a city name");
      return;
    }
    await fetchMetrics(city.trim());
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get("/alerts")
      .then(res => setAlerts(res.data))
      .catch(err => console.error("Error fetching alerts:", err));
  }, []);

  // Handle alert form submission
const handleAlertSubmit = async (newAlert) => {
  try {
    const res = await axios.post("/alerts", newAlert);
    const savedAlert = res.data.alert;

    setAlerts((prev) => [savedAlert, ...prev]); // Add to active alerts
    setAlertHistory((prev) => [savedAlert, ...prev]); // Add to history
    setIsAlertFormOpen(false);
  } catch (err) {
    console.error("Error creating alert:", err);
    alert("Failed to create alert. Please try again.");
  }
};



  // Get alert color based on level
  const getAlertColor = (level) => {
    switch(level) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };

  // Get alert icon based on type
  const getAlertIcon = (type) => {
    switch(type) {
      case 'storm': return 'fa-exclamation-triangle';
      case 'erosion': return 'fa-exclamation-circle';
      case 'pollution': return 'fa-info-circle';
      default: return 'fa-bell';
    }
  };

  // Tab Components
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 font-poppins">Coastal Monitoring Dashboard</h2>
        <p className="text-lg text-gray-600 font-poppins">Real-time monitoring of coastal threats and environmental metrics</p>
      </div>

      {/* Alert Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-poppins">Current Threat Alerts</h3>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full font-poppins">
            {alerts.length} Active
          </span>
        </div>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`flex items-start p-4 border rounded-lg bg-${getAlertColor(alert.level)}-50 border-${getAlertColor(alert.level)}-200`}
            >
              <div className={`flex-shrink-0 text-${getAlertColor(alert.level)}-600 text-xl mr-3`}>
                <i className={`fas ${getAlertIcon(alert.type)}`}></i>
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-${getAlertColor(alert.level)}-700 text-lg font-poppins`}>{alert.title}</h4>
                <p className="text-base text-gray-600 font-poppins">{alert.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500 font-poppins">
                  <span><i className="fas fa-clock mr-1"></i> Updated {alert.time}</span>
                  <span className="mx-2">•</span>
                  <span><i className="fas fa-map-marker-alt mr-1"></i> {alert.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Environmental Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <i className="fas fa-temperature-high text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-base text-gray-600 font-poppins">Water Temp</p>
                <p className="text-2xl font-bold font-poppins">{metrics.temp || 'N/A'}°C</p>
              </div>
            </div>
            <p className="text-sm mt-2 text-green-600 font-poppins"><i className="fas fa-arrow-up"></i> 1.2°C from yesterday</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <i className="fas fa-ruler-combined text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-base text-gray-600 font-poppins">Sea Level</p>
                <p className="text-2xl font-bold font-poppins">{metrics.seaLevel || 'N/A'}m</p>
              </div>
            </div>
            <p className="text-sm mt-2 text-red-600 font-poppins"><i className="fas fa-arrow-up"></i> 0.08m from average</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <i className="fas fa-wind text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-base text-gray-600 font-poppins">Wind Speed</p>
                <p className="text-2xl font-bold font-poppins">{metrics.windSpeed || 'N/A'} km/h</p>
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-600 font-poppins">Direction: {metrics.windDirection || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Coastal Threat Map</h3>
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 h-64 rounded-lg flex items-center justify-center">
          <div className="text-center text-blue-700">
            <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
            <p className="text-lg font-poppins">Interactive threat visualization map</p>
            <p className="text-sm font-poppins">(Would show real-time sensor data and threat locations)</p>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Notification Center</h3>
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium text-blue-700 text-base font-poppins">{notif.title}</span>
                <span className="text-sm text-gray-500 font-poppins">{notif.time}</span>
              </div>
              <p className="text-base mt-1 font-poppins">{notif.description}</p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md text-base font-poppins">
          View All Notifications
        </button>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 font-poppins">Threat Alerts Management</h2>
        <button
          onClick={() => setIsAlertFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center font-poppins"
          disabled={loading}
        >
          <i className="fas fa-plus mr-2"></i> Create New Alert
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`bg-white rounded-xl shadow-md p-5 border-l-4 border-${getAlertColor(alert.level)}-500`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`text-${getAlertColor(alert.level)}-500 text-xl`}>
                <i className={`fas ${getAlertIcon(alert.type)}`}></i>
              </div>
             <span className={`bg-${getAlertColor(alert.severity)}-100 text-${getAlertColor(alert.severity)}-800 text-xs px-2.5 py-0.5 rounded-full font-poppins`}>
  {alert?.severity?.toUpperCase()}
</span>

            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2 font-poppins">{alert.title}</h3>
            <p className="text-gray-600 text-base mb-4 font-poppins">{alert.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 font-poppins">
              <span><i className="fas fa-map-marker-alt mr-1"></i> {alert.location}</span>
              <span><i className="fas fa-clock mr-1"></i> {alert.time}</span>
            </div>
          </div>
        ))}
        {/* Alert History Section */}
<div className="mt-8">
  <h3 className="text-lg font-bold text-gray-800 mb-4">Alert History</h3>
  <div className="space-y-3 max-h-64 overflow-y-auto">
    {alertHistory.length === 0 ? (
      <p className="text-sm text-gray-500">No past alerts yet.</p>
    ) : (
      alertHistory.map(alert => (
        <div
          key={alert.id}
          className="p-4 bg-gray-50 border rounded-lg shadow-sm"
        >
          <div className="flex justify-between">
            <h4 className="font-semibold text-gray-800">{alert.title}</h4>
            <span className="text-xs text-gray-500">{alert.time}</span>
          </div>
          <p className="text-sm text-gray-600">{alert.description}</p>
          <div className="text-xs text-gray-500 mt-1">
            <i className="fas fa-map-marker-alt mr-1"></i> {alert.location}
          </div>
        </div>
      ))
    )}
  </div>
</div>

      </div>
      
      {isAlertFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <AlertForm
              onSubmit={handleAlertSubmit}
              onCancel={() => setIsAlertFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 font-poppins">Environmental Metrics</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md flex-grow text-base font-poppins"
            placeholder="Enter city name"
            disabled={loading}
          />
          <button
            onClick={handleSearchCity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center min-w-[120px] font-poppins"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i> Search
              </>
            )}
          </button>
        </div>
        
        {metrics.temp && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <i className="fas fa-temperature-high text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-base text-gray-600 font-poppins">Temperature</p>
                  <p className="text-2xl font-bold font-poppins">{metrics.temp}°C</p>
                </div>
              </div>
              <p className="text-xs text-green-600 font-poppins"><i className="fas fa-arrow-up"></i> 1.2°C from yesterday</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <i className="fas fa-tint text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-base text-gray-600 font-poppins">Humidity</p>
                  <p className="text-2xl font-bold font-poppins">{metrics.humidity}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-poppins">Ideal range: 40-60%</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <i className="fas fa-wind text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-base text-gray-600 font-poppins">Wind Speed</p>
                  <p className="text-2xl font-bold font-poppins">{metrics.windSpeed} km/h</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-poppins">Direction: {metrics.windDirection}°</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-yellow-100 p-3 mr-4">
                  <i className="fas fa-compress-arrows-alt text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-base text-gray-600 font-poppins">Pressure</p>
                  <p className="text-2xl font-bold font-poppins">{metrics.pressure} hPa</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-poppins">Normal range: 1013 hPa</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-indigo-100 p-3 mr-4">
                  <i className="fas fa-cloud-rain text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-base text-gray-600 font-poppins">Rain (last 1h)</p>
                  <p className="text-2xl font-bold font-poppins">{metrics.rain || 0} mm</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-poppins">Precipitation level</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl border border-teal-200">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-teal-100 p-3 mr-4">
                  <i className="fas fa-water text-teal-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-base text-gray-600 font-poppins">Sea Level</p>
                  <p className="text-2xl font-bold font-poppins">{metrics.seaLevel} m</p>
                </div>
              </div>
              <p className="text-xs text-red-600 font-poppins"><i className="fas fa-arrow-up"></i> 0.08m from average</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMaps = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 font-poppins">Coastal Threat Map</h2>

      <div className="bg-white rounded-xl shadow-md p-6">
        <WeatherMap alerts={alerts} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Threat Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base font-poppins">Storm Surge</span>
              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{width: '65%'}}></div>
              </div>
              <span className="text-gray-800 font-medium text-base font-poppins">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base font-poppins">Coastal Erosion</span>
              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '42%'}}></div>
              </div>
              <span className="text-gray-800 font-medium text-base font-poppins">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base font-poppins">Pollution</span>
              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '28%'}}></div>
              </div>
              <span className="text-gray-800 font-medium text-base font-poppins">28%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Recent Incidents</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-red-100 text-red-800 p-2 rounded-lg mr-3">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <p className="text-base font-medium font-poppins">Storm surge detected</p>
                <p className="text-sm text-gray-500 font-poppins">Sector 4B • 15 min ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded-lg mr-3">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div>
                <p className="text-base font-medium font-poppins">Erosion alert</p>
                <p className="text-sm text-gray-500 font-poppins">South Beach • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                <i className="fas fa-info-circle"></i>
              </div>
              <div>
                <p className="text-base font-medium font-poppins">Water quality advisory</p>
                <p className="text-sm text-gray-500 font-poppins">Bay Area • 5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 font-poppins">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg font-poppins">Threat Reports</h3>
            <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
              <i className="fas fa-file-alt"></i>
            </div>
          </div>
          <p className="text-gray-600 text-base mb-4 font-poppins">Generate detailed reports on coastal threats and incidents</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-base font-poppins">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg font-poppins">Environmental Data</h3>
            <div className="bg-green-100 text-green-800 p-2 rounded-lg">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <p className="text-gray-600 text-base mb-4 font-poppins">Export environmental metrics and trends analysis</p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-base font-poppins">
            Export Data
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg font-poppins">Alert History</h3>
            <div className="bg-purple-100 text-purple-800 p-2 rounded-lg">
              <i className="fas fa-history"></i>
            </div>
          </div>
          <p className="text-gray-600 text-base mb-4 font-poppins">View historical alert data and response effectiveness</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-base font-poppins">
            View History
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Monthly Incident Trends</h3>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <i className="fas fa-chart-bar text-4xl mb-2"></i>
            <p className="text-lg font-poppins">Incident trend visualization</p>
            <p className="text-sm font-poppins">(Would show monthly incident reports and trends)</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col font-poppins">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-cyan-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <i className="fas fa-water text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Coastal Threat Alert System</h1>
              <p className="text-sm text-blue-100">Protecting coastal communities</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden text-blue-600 font-semibold md:flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <i className="fas fa-user-circle"></i>
              <span className="text-base">Welcome, {user?.name}</span>
            </div>
            <button
              className="bg-white text-blue-600 font-semibold bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md flex items-center transition-all text-base"
              onClick={handleLogout}
              disabled={loading}
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: "overview", label: "Overview", icon: "fa-home" },
              { id: "alerts", label: "Alerts", icon: "fa-bell" },
              { id: "metrics", label: "Metrics", icon: "fa-chart-bar" },
              { id: "maps", label: "Maps", icon: "fa-map" },
              { id: "reports", label: "Reports", icon: "fa-file-alt" }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-5 py-4 font-medium text-base flex items-center space-x-2 border-b-2 transition-all ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "alerts" && renderAlerts()}
        {activeTab === "metrics" && renderMetrics()}
        {activeTab === "maps" && renderMaps()}
        {activeTab === "reports" && renderReports()}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-cyan-700 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base">Coastal Threat Alert System © 2023 | Protecting coastal ecosystems and communities</p>
          <p className="mt-1 text-blue-200 text-sm">Data updates every 15 minutes | System status: <span className="text-green-300">Operational</span></p>
        </div>
      </footer>

      {/* Add Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Add Poppins font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </div>
  );
}