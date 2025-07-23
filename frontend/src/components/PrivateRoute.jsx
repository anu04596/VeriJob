import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from "react";


export default function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
}