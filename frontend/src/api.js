// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('authToken');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token};Basic U0ItTWlkLXNlcnZlci0xVWgwZjJSLUhPb3pLTlBnczMwcjRVUGs=`;
}

export default api;
