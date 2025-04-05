import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8080/api"; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request (Gắn token vào header)
api.interceptors.request.use(
  async (config) => {
    let token = authService.getAccessToken();
    
    if (token) {
      // Kiểm tra nếu token hết hạn trước khi request
      if (authService.isTokenExpired(token)) {
        try {
          const newTokens = await authService.refreshToken();
          token = newTokens.accessToken;
        } catch (error) {
          console.error("Lỗi khi refresh token:", error);
          authService.handleLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          return Promise.reject(error);
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);



export default api;
