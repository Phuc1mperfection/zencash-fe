import { createContext, useState, useEffect, FC, ReactNode } from "react";
import { LoginCredentials } from "@/types/LoginCredentials";
import { SignupData } from "@/types/SignupData";
import { AuthResponse } from "@/types/AuthResponse";
import authService from "@/services/authService";
import { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
  hasRole: (role: string) => boolean;
  userRoles: string[];
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {

    // Ensure userRoles is an array before using includes
    if (!Array.isArray(userRoles)) {
      console.warn("userRoles is not an array:", userRoles);
      return false;
    }

    const hasTheRole = userRoles.includes(role);
    return hasTheRole;
  };

  // Check token on initialization
  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Process roles from currentUser (could be Set, Array, or Object)
        let processedRoles: string[] = [];

        if (currentUser.roles) {
          if (Array.isArray(currentUser.roles)) {
            processedRoles = currentUser.roles;
          } else if (typeof currentUser.roles === "object") {
            // Could be a Java Set converted to an object in JSON
            processedRoles = Object.values(currentUser.roles) as string[];
          }
        }
        setUser({
          username: currentUser.username,
          email: currentUser.email,
          fullname: currentUser.fullname || "",
          currency: currentUser.currency || "",
          avatar: currentUser.avatar || "",
          roles: processedRoles,
        });
        setIsAuthenticated(true);
        setUserRoles(processedRoles);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);

    // Process roles from response (could be Set, Array, or Object)
    let processedRoles: string[] = [];

    if (response.roles) {
      if (Array.isArray(response.roles)) {
        processedRoles = response.roles;
      } else if (typeof response.roles === "object") {
        // Could be a Java Set converted to an object in JSON
        processedRoles = Object.values(response.roles) as string[];
      }
    }
    // Set user with roles included
    setUser({
      username: response.username,
      email: response.email,
      fullname: response.fullname || "",
      currency: response.currency || "",
      avatar: response.avatar || "",
      roles: processedRoles,
    });
    setIsAuthenticated(true);
    setUserRoles(processedRoles);

    // Store roles in localStorage
    localStorage.setItem("userRoles", JSON.stringify(processedRoles));

    // Return the response with processed roles for redirection logic
    return { ...response, roles: processedRoles };
  };

  const signup = async (data: SignupData) => {
    await authService.signup(data);
    const loginResponse = await authService.login({
      email: data.email,
      passwordRaw: data.password,
    });

    // Process roles from response (could be Set, Array, or Object)
    let processedRoles: string[] = [];

    if (loginResponse.roles) {
      if (Array.isArray(loginResponse.roles)) {
        processedRoles = loginResponse.roles;
      } else if (typeof loginResponse.roles === "object") {
        // Could be a Java Set converted to an object in JSON
        processedRoles = Object.values(loginResponse.roles) as string[];
      }
    }

    setUser({
      username: loginResponse.username,
      email: loginResponse.email,
      fullname: loginResponse.fullname || "",
      currency: loginResponse.currency || "",
      avatar: loginResponse.avatar || "",
      roles: processedRoles,
    });
    setIsAuthenticated(true);
    setUserRoles(processedRoles);

    localStorage.setItem("userRoles", JSON.stringify(processedRoles));

    return { ...loginResponse, roles: processedRoles };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        setUser,
        hasRole,
        userRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
