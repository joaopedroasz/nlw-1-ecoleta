import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.12:8000',
});

export default api;
