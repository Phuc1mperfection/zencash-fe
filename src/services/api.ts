import axios, { AxiosError } from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api'; // Adjust this to match your Spring Boot backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
      try {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { accessToken } = response.data;
        authService.setTokens(response.data);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers['X-Retry'] = 'true';
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout the user
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 