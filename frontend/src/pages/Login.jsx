// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const App = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [isError, setIsError] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();

//     // const handleSubmit = (event) => {
//     //     event.preventDefault(); 

//     //     if (email.trim() === '' || password.trim() === '') {
//     //         setMessage('Email and password are required.');
//     //         setIsError(true);
//     //     } else {
//     //         // Simulating a successful login
//     //         setMessage('Login successful! Welcome.');
//     //         setIsError(false);
//     //         navigate('/dashboard');
//     //         console.log('Login attempt with:', { email, password });
//     //     }
//     // };

//      const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await apiLogin({ email, password });
//       login(res.data); // store user & token in context + localStorage
//       navigate("/dashboard"); // navigate after successful login
//     } catch (err) {
//       console.error("Login failed:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//     return (
//         <div className="flex items-center justify-center min-h-screen p-4 overflow-hidden relative">
//             {/* Styles for special effects, embedded for single-file use */}
//             <style>
//                 {`
//                 @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

//                 body {
//                     font-family: 'Poppins', sans-serif;
//                     background: linear-gradient(135deg, #020815, #001f4d, #043657);
//                 }

//                 .login-container {
//                     backdrop-filter: blur(15px);
//                     background: rgba(0, 0, 0, 0.3);
//                     border: 1px solid rgba(255, 255, 255, 0.1);
//                     box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
//                 }

//                 .login-input {
//                     background-color: rgba(0, 0, 0, 0.2);
//                     border: 1px solid rgba(255, 255, 255, 0.2);
//                     color: #fff;
//                     font-family: 'Poppins', sans-serif;
//                     transition: border-color 0.3s, box-shadow 0.3s;
//                 }

//                 .login-input:focus {
//                     border-color: #00CCFF;
//                     box-shadow: 0 0 0 2px rgba(0, 204, 255, 0.5);
//                 }

//                 .login-input::placeholder {
//                     color: rgba(255, 255, 255, 0.5);
//                 }

//                 .login-button {
//                     background: #005f9c;
//                     transition: background 0.3s ease;
//                 }

//                 .login-button:hover {
//                     background: #003e66;
//                 }
                
//                 .show-password-btn {
//                     background: none;
//                     border: none;
//                     cursor: pointer;
//                     color: rgba(255, 255, 255, 0.6);
//                     transition: color 0.2s ease-in-out;
//                 }

//                 .show-password-btn:hover {
//                     color: #00CCFF;
//                 }
//                 `}
//             </style>
            
//             {/* Raised project name in the background */}
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
//                 <h1 className="text-[10rem] font-black text-blue-950 opacity-10 drop-shadow-lg transform -rotate-6">
//                     Blue Carbon
//                 </h1>
//             </div>

//             {/* Login Container */}
//             <div className="login-container w-full max-w-sm p-8 rounded-2xl text-white relative z-10">
//                 <div className="flex flex-col items-center mb-6">
//                     <h1 className="text-3xl font-bold mb-2 text-center drop-shadow-lg">Login</h1>
//                     <p className="text-sm text-center opacity-80 drop-shadow">Welcome back! Please sign in.</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="email" className="text-sm font-semibold text-white drop-shadow-sm block mb-2">Email Address</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             placeholder="example@hackathon.com"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="login-input w-full p-3 rounded-xl focus:outline-none"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password" className="text-sm font-semibold text-white drop-shadow-sm block mb-2">Password</label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? 'text' : 'password'}
//                                 id="password"
//                                 name="password"
//                                 placeholder="••••••••"
//                                 required
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="login-input w-full p-3 rounded-xl focus:outline-none pr-10"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//                             >
//                                 {showPassword ? (
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
//                                         <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//                                         <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//                                         <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.76 9.76 0 0 0 5.46-1.39" />
//                                         <line x1="2" x2="22" y1="2" y2="22" />
//                                     </svg>
//                                 ) : (
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
//                                         <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//                                         <circle cx="12" cy="12" r="3" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                     <div className="pt-4 flex flex-col space-y-2">
//                         <button
//                             type="submit"
//                             className="login-button w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
//                         >
//                             Login
//                         </button>
//                     </div>
//                 </form>
//                 <div className="mt-6 text-center text-sm font-medium">
//                     <p className="text-gray-400">
//                         Don't have an account?{' '}
//                         <a href="/signup" className="text-blue-300 hover:text-white font-bold transition-colors duration-300">
//                             Sign Up
//                         </a>
//                     </p>
//                 </div>
//                 {message && (
//                     <div
//                         className={`mt-4 text-center text-sm font-medium transition-all duration-300 transform scale-100 opacity-100 ${isError ? 'text-red-400' : 'text-green-400'}`}
//                     >
//                         {message}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default App;



import React, { useState } from "react";
import axios from "./../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setMessage("Both fields are required.");
      setIsError(true);
      return;
    }

    try {
      const res = await axios.post("/users/login", {
        email,
        password,
      });

      // save user info + token
      localStorage.setItem("user", JSON.stringify(res.data));

      setIsError(false);
      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Login failed");
      setIsError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #020815, #001f4d, #043657);
          }
          .login-container {
            backdrop-filter: blur(15px);
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          }
          .login-input {
            background-color: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            transition: border-color 0.3s, box-shadow 0.3s;
          }
          .login-input:focus {
            border-color: #00CCFF;
            box-shadow: 0 0 0 2px rgba(0, 204, 255, 0.5);
          }
          .login-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
          .login-button {
            background: #005f9c;
            transition: background 0.3s ease;
          }
          .login-button:hover {
            background: #003e66;
          }
        `}
      </style>

      {/* Project title in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[10rem] font-black text-blue-950 opacity-10 drop-shadow-lg transform -rotate-6">
          Blue Carbon
        </h1>
      </div>

      {/* Login Container */}
      <div className="login-container w-full max-w-sm p-8 rounded-2xl text-white relative z-10">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center drop-shadow-lg">Login</h1>
          <p className="text-sm text-center opacity-80 drop-shadow">Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-white drop-shadow-sm block mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input w-full p-3 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-white drop-shadow-sm block mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input w-full p-3 rounded-xl focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            <button
              type="submit"
              className="login-button w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm font-medium">
          <p className="text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-300 hover:text-white font-bold transition-colors duration-300"
            >
              Sign Up
            </a>
          </p>
        </div>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium ${
              isError ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
