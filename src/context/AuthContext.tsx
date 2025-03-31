import React, { createContext, useContext, useState, useEffect } from "react";
import authService, {
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "../services/authService";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => void;
  getCurrentUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser() as User | null;
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser({
      username: response.username,
      email: response.email,
    });
    setIsAuthenticated(true);
    return response;
  };

  const signup = async (data: SignupData) => {
    // First, sign up the user
    await authService.signup(data);

    // Then, automatically log in the user with the same credentials
    const loginResponse = await authService.login({
      email: data.email,
      passwordRaw: data.password,
    });

    // Set the user state with the login response
    setUser({
      username: loginResponse.username,
      email: loginResponse.email,
    });
    setIsAuthenticated(true);

    return loginResponse;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const getCurrentUser = () => {
    return authService.getCurrentUser() as User | null;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout, getCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
