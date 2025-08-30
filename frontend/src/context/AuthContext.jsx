  // import { createContext, useState, useEffect } from "react";

  // export const AuthContext = createContext();

  // export const AuthProvider = ({ children }) => {
  //   const [user, setUser] = useState(() => {
  //     return JSON.parse(localStorage.getItem("user")) || null;
  //   });

  //   const login = (data) => {
  //     localStorage.setItem("user", JSON.stringify(data));
  //     setUser(data);
  //   };

  //   const logout = () => {
  //     localStorage.removeItem("user");
  //     setUser(null);
  //   };

  //   return (
  //     <AuthContext.Provider value={{ user, login, logout }}>
  //       {children}
  //     </AuthContext.Provider>
  //   );
  // };


import React, { createContext, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          '/users/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      throw err; // Allow components to handle errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};