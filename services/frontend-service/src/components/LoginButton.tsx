
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

interface LoginButtonProps {
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ className }) => {
  const { login } = useAuth();

  return (
    <Button
      onClick={login}
      className={`bg-primary text-white px-8 py-6 rounded-full text-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95 ${className}`}
    >
      S'authentifier
    </Button>
  );
};

export default LoginButton;
