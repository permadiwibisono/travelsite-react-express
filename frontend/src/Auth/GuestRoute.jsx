import React from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

export const AdminRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('userData'));

  if (!token) {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
