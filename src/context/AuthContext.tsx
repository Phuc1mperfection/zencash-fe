import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from "react";
import authService, {
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "../services/authService";

interface User {
  username: string;
  email: string;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        });
        setIsAuthenticated(true);
      }
    };

    initializeAuth();
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
    await authService.signup(data);
    const loginResponse = await authService.login({
      email: data.email,
      passwordRaw: data.password,
    });

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

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
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
