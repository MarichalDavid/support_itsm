
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isInitialized, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate("/");
    }
  }, [isInitialized, isLoggedIn, navigate]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="loading-dot loading-dot-1"></div>
          <div className="loading-dot loading-dot-2"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    );
  }

  return isLoggedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
