import { createContext, useState, useEffect, FC, ReactNode } from "react";
import { LoginCredentials } from "@/types/LoginCredentials";
import { SignupData } from "@/types/SignupData";
import { AuthResponse } from "@/types/AuthResponse";
import authService from "@/services/authService";
import { User } from "@/types/User";
import i18n from "@/i18n";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Kiểm tra token khi khởi tạo
  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser({
          username: currentUser.username,
          email: currentUser.email,
          fullname: currentUser.fullname || "",
          currency: currentUser.currency || "",
          language: currentUser.language || "",
        });
        setIsAuthenticated(true);

        // Khởi tạo ngôn ngữ từ user
        if (currentUser.language) {
          i18n.changeLanguage(currentUser.language);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser({
      username: response.username,
      email: response.email,
      fullname: response.fullname || "",
      currency: response.currency || "",
      language: response.language || "",
    });
    setIsAuthenticated(true);

    // Cập nhật ngôn ngữ sau khi đăng nhập
    if (response.language) {
      i18n.changeLanguage(response.language);
    }

    return response;
  };

  const signup = async (data: SignupData) => {
    await authService.signup(data);
    const loginResponse = await authService.login({
      email: data.email,
      passwordRaw: data.password,
    });

    setUser({
      username: loginResponse.username,
      email: loginResponse.email,
      fullname: loginResponse.fullname || "",
      currency: loginResponse.currency || "",
      language: loginResponse.language || "",
    });
    setIsAuthenticated(true);

    // Cập nhật ngôn ngữ sau khi đăng ký
    if (loginResponse.language) {
      i18n.changeLanguage(loginResponse.language);
    }

    return loginResponse;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
