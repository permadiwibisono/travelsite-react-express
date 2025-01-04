// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('authToken');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token};Basic U0ItTWlkLXNlcnZlci0xVWgwZjJSLUhPb3pLTlBnczMwcjRVUGs=`;
}

export default api;
