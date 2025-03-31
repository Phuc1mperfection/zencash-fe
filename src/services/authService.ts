import axios from "axios";

export interface LoginCredentials {
  email: string;
  passwordRaw: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

const API_URL = "http://localhost:8080/api";

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Making login request to:', `${API_URL}/auth/login`);
    console.log('Login request body:', credentials);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('Login response data:', response.data);
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("email", response.data.email);
        console.log('Tokens stored in localStorage');
      }
      return response.data;
    } catch (error) {
      console.error('Login request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
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
    console.log('User logged out, tokens removed');
  },

  getCurrentUser(): AuthResponse | null {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // In a real application, you would decode the JWT token here
      // For now, we'll return a mock user
      return {
        username: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
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
};

export default authService; 