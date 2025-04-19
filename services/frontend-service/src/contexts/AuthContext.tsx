
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initKeycloak, isAuthenticated, login, logout, getUsername } from "../services/keycloak";

interface AuthContextType {
  isInitialized: boolean;
  isLoggedIn: boolean;
  username: string;
  login: () => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isInitialized: false,
  isLoggedIn: false,
  username: "",
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initKeycloak();
        setIsInitialized(true);
        setIsLoggedIn(isAuthenticated());
        if (isAuthenticated()) {
          setUsername(getUsername());
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const authContextValue: AuthContextType = {
    isInitialized,
    isLoggedIn,
    username,
    login,
    logout: () => {
      logout();
      setIsLoggedIn(false);
      setUsername("");
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
