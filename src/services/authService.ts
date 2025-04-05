import axios from "axios";
import {jwtDecode} from "jwt-decode";

export interface LoginCredentials {
  email: string;
  passwordRaw: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  name?: string | null;
}

export interface AuthResponse {
  username: string;
  email: string;
  name?: string | null;
  accessToken: string;
  refreshToken: string;
}

const API_URL = "http://localhost:8080/api";

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.accessToken) {
        // Lưu thông tin user từ response
        this.setUserInfo({
          username: response.data.username || credentials.email.split('@')[0], // Nếu không có username, lấy phần trước @ của email
          email: response.data.email,
          name: response.data.name || null,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
      }
      return response.data;
    } catch (error) {
      console.error('Login request failed:', error);
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
    localStorage.removeItem("name");
    console.log('User logged out, tokens removed');
  },

  getCurrentUser(): AuthResponse | null {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return {
        username: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("name") || null,
        accessToken,
        refreshToken: localStorage.getItem("refreshToken") || "",
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
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken, username, email, name } = response.data;
      this.setUserInfo({
        username: username || email.split('@')[0], // Nếu không có username, lấy phần trước @ của email
        email,
        name: name || null,
        accessToken,
        refreshToken: newRefreshToken
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
    if (data.name) {
      localStorage.setItem("name", data.name);
    } else {
      localStorage.removeItem("name");
    }
  },
};

export default authService; 