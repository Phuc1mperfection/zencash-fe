import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { AuthResponse } from "@/types/AuthResponse";
import { LoginCredentials } from "@/types/LoginCredentials";
import { SignupData } from "@/types/SignupData";
import { User } from "@/types/User";    
import api from "./api";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:8080/api";

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Making login request to:', `${API_URL}/auth/login`);
      console.log('Login request body:', JSON.stringify(credentials, null, 2));
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('Login response data:', response.data);
      
      if (response.data.accessToken) {
        // Lưu thông tin user từ response
        this.setUserInfo({
          username: response.data.username,
          email: response.data.email,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          fullname: response.data.fullname
        });
      }
      return response.data;
    } catch (error) {
      console.error('Login request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response data:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
      }
      throw error;
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    console.log('Making signup request to:', `${API_URL}/auth/signup`);
    console.log('Signup request body:', data);
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      console.log('Signup response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    console.log('User logged out, tokens removed');
  },

  getCurrentUser(): AuthResponse | null {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return {
        username: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        accessToken,
        refreshToken: localStorage.getItem("refreshToken") || "",
        fullname: localStorage.getItem("fullname") || ""
      };
    }
    return null;
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  isTokenExpired(token: string): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return true;
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken, username, email, fullname } = response.data;
      this.setUserInfo({
        username: username,
        email: email,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
        fullname: fullname
      });
      
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  handleLogout(message?: string): void {
    if (message) {
      // Hiển thị thông báo cho người dùng
      alert(message);
    }
    this.logout();
    window.location.href = '/login';
  },

  setUserInfo(data: AuthResponse): void {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    localStorage.setItem("fullname", data.fullname || "");
  },
  
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      console.log('Making profile update request to:', `${API_URL}/users/me`);
      console.log('Profile update request body:', userData);
      
      const response = await api.put(`/users/me`, userData);
      console.log('Profile update response:', response.data);
      
      // Update localStorage with new user data
      if (response.data) {
        this.setUserInfo({
          username: response.data.username || localStorage.getItem("username") || "",
          email: response.data.email || localStorage.getItem("email") || "",
          accessToken: localStorage.getItem("accessToken") || "",
          refreshToken: localStorage.getItem("refreshToken") || "",
          fullname: response.data.fullname || localStorage.getItem("fullname") || ""
        });
        
        // Show success toast at service level
        toast.success('Profile updated successfully');
      }
      
      return response.data;
    } catch (error) {
      console.error('Profile update request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        // Show error toast at service level
        const errorMessage = error.response?.data?.message || 'Failed to update profile';
        toast.error(errorMessage);
      }
      throw error;
    }
  }
};


export default authService; 