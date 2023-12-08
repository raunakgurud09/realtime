import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// use any one for ts
export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuth();

  // If there is a valid token and user ID, navigate the user to the chat page
  if (token && user?._id) return <Navigate to="/chat" replace />;

  // If no token or user ID exists, render the child components as they are
  return children;
}
