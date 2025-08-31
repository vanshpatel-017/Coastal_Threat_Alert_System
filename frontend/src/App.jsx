import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AlertForm from "./pages/AlertForm";
import FloodForm from "./components/FloodForm";
import Predicted from "./components/Predicted";
import CyclonePredictor from "./components/CyclonePredictor";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/alertform" element={<AlertForm />} />
          <Route path="/floodform" element={<FloodForm />} />
          <Route path="/predicted" element={<Predicted />} />
          <Route path="/dashboard/cyclonepredictor" element={<CyclonePredictor />} />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <Dashboard />
              //  </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/cyclonepredictor"
            element={
              <CyclonePredictor />
            }
          /> */}
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;